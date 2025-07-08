const xml2js = require('xml2js');
const winston = require('winston');

// Configurar logger para este módulo
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class XMLController {
  // Converter XML de NF-e para JSON
  static async parseXMLToJSON(req, res) {
    try {
      const { xml } = req.body;

      // Validar se XML foi enviado
      if (!xml) {
        return res.status(400).json({
          success: false,
          message: 'XML é obrigatório',
          errors: ['Campo xml não pode estar vazio']
        });
      }

      // Configurar parser XML
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: true,
        explicitRoot: false,
        trim: true
      });

      // Converter XML para JSON
      const jsonResult = await parser.parseStringPromise(xml);
      
      // Processar NF-e e adicionar campos personalizados
      const processedResult = XMLController.processNFe(jsonResult);

      logger.info('XML convertido com sucesso para JSON');

      return res.status(200).json({
        success: true,
        message: 'XML convertido com sucesso',
        data: processedResult,
        meta: {
          totalProdutos: XMLController.countProducts(processedResult),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Erro ao processar XML:', error);

      // Verificar se é erro de XML malformado
      if (error.message.includes('Non-whitespace before first tag')) {
        return res.status(400).json({
          success: false,
          message: 'XML malformado',
          errors: ['O XML enviado não está em formato válido']
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno ao processar XML',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  // Processar estrutura da NF-e
  static processNFe(nfeData) {
    try {
      // Detectar estrutura da NF-e
      let infNFe = null;
      
      // Tentar diferentes estruturas possíveis da NF-e
      if (nfeData.NFe && nfeData.NFe.infNFe) {
        infNFe = nfeData.NFe.infNFe;
      } else if (nfeData.infNFe) {
        infNFe = nfeData.infNFe;
      } else if (nfeData.nfeProc && nfeData.nfeProc.NFe && nfeData.nfeProc.NFe.infNFe) {
        infNFe = nfeData.nfeProc.NFe.infNFe;
      }

      if (!infNFe) {
        logger.warn('Estrutura NF-e não reconhecida, retornando dados originais');
        return nfeData;
      }

      // Processar produtos (det)
      if (infNFe.det) {
        const produtos = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];
        
        produtos.forEach(produto => {
          if (produto.prod) {
            // Adicionar campos personalizados
            produto.prod.icProd = ''; // Código interno do produto (em branco)
            produto.prod.ixProd = ''; // Descrição interna do produto (em branco)
            
            // Log para debug
            logger.info(`Produto processado: ${produto.prod.cProd} - ${produto.prod.xProd}`);
          }
        });
      }

      return nfeData;

    } catch (error) {
      logger.error('Erro ao processar estrutura da NF-e:', error);
      return nfeData; // Retorna dados originais em caso de erro
    }
  }

  // Contar produtos na NF-e
  static countProducts(nfeData) {
    try {
      let infNFe = null;
      
      if (nfeData.NFe && nfeData.NFe.infNFe) {
        infNFe = nfeData.NFe.infNFe;
      } else if (nfeData.infNFe) {
        infNFe = nfeData.infNFe;
      } else if (nfeData.nfeProc && nfeData.nfeProc.NFe && nfeData.nfeProc.NFe.infNFe) {
        infNFe = nfeData.nfeProc.NFe.infNFe;
      }

      if (!infNFe || !infNFe.det) {
        return 0;
      }

      return Array.isArray(infNFe.det) ? infNFe.det.length : 1;
    } catch (error) {
      logger.error('Erro ao contar produtos:', error);
      return 0;
    }
  }

  // Extrair informações específicas da NF-e
  static async extractNFeInfo(req, res) {
    try {
      const { xml } = req.body;

      if (!xml) {
        return res.status(400).json({
          success: false,
          message: 'XML é obrigatório'
        });
      }

      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: true,
        explicitRoot: false,
        trim: true
      });

      const jsonResult = await parser.parseStringPromise(xml);
      
      // Extrair informações específicas
      const info = XMLController.extractBasicInfo(jsonResult);
      const produtos = XMLController.extractProducts(jsonResult);

      return res.status(200).json({
        success: true,
        message: 'Informações extraídas com sucesso',
        data: {
          nfe: info,
          produtos: produtos
        }
      });

    } catch (error) {
      logger.error('Erro ao extrair informações da NF-e:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao extrair informações',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
      });
    }
  }

  // Extrair informações básicas da NF-e
  static extractBasicInfo(nfeData) {
    try {
      let infNFe = null;
      
      if (nfeData.NFe && nfeData.NFe.infNFe) {
        infNFe = nfeData.NFe.infNFe;
      } else if (nfeData.infNFe) {
        infNFe = nfeData.infNFe;
      } else if (nfeData.nfeProc && nfeData.nfeProc.NFe && nfeData.nfeProc.NFe.infNFe) {
        infNFe = nfeData.nfeProc.NFe.infNFe;
      }

      if (!infNFe) {
        return {};
      }

      return {
        chave: infNFe.Id ? infNFe.Id.replace('NFe', '') : '',
        numero: infNFe.ide ? infNFe.ide.nNF : '',
        serie: infNFe.ide ? infNFe.ide.serie : '',
        dataEmissao: infNFe.ide ? infNFe.ide.dhEmi : '',
        cnpjEmitente: infNFe.emit && infNFe.emit.CNPJ ? infNFe.emit.CNPJ : '',
        nomeEmitente: infNFe.emit && infNFe.emit.xNome ? infNFe.emit.xNome : '',
        valorTotal: infNFe.total && infNFe.total.ICMSTot ? infNFe.total.ICMSTot.vNF : '0.00'
      };
    } catch (error) {
      logger.error('Erro ao extrair informações básicas:', error);
      return {};
    }
  }

  // Extrair produtos da NF-e
  static extractProducts(nfeData) {
    try {
      let infNFe = null;
      
      if (nfeData.NFe && nfeData.NFe.infNFe) {
        infNFe = nfeData.NFe.infNFe;
      } else if (nfeData.infNFe) {
        infNFe = nfeData.infNFe;
      } else if (nfeData.nfeProc && nfeData.nfeProc.NFe && nfeData.nfeProc.NFe.infNFe) {
        infNFe = nfeData.nfeProc.NFe.infNFe;
      }

      if (!infNFe || !infNFe.det) {
        return [];
      }

      const produtos = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];
      
      return produtos.map(item => {
        const prod = item.prod || {};
        return {
          cProd: prod.cProd || '',           // Código do produto do fornecedor
          icProd: '',                        // Código interno do produto (em branco)
          ixProd: '',                        // Descrição interna do produto (em branco)
          xProd: prod.xProd || '',           // Descrição do produto
          NCM: prod.NCM || '',               // Código NCM
          CFOP: prod.CFOP || '',             // CFOP
          uCom: prod.uCom || '',             // Unidade comercial
          qCom: prod.qCom || '0',            // Quantidade comercial
          vUnCom: prod.vUnCom || '0.00',     // Valor unitário
          vProd: prod.vProd || '0.00',       // Valor do produto
          EAN: prod.cEAN || '',              // Código EAN
          orig: prod.orig || '0'             // Origem do produto
        };
      });
    } catch (error) {
      logger.error('Erro ao extrair produtos:', error);
      return [];
    }
  }

  // Validar se XML é de NF-e
  static async validateNFe(req, res) {
    try {
      const { xml } = req.body;

      if (!xml) {
        return res.status(400).json({
          success: false,
          message: 'XML é obrigatório'
        });
      }

      // Verificar se contém estrutura básica de NF-e
      const isValidNFe = xml.includes('<NFe') || xml.includes('<infNFe') || xml.includes('<nfeProc');
      
      if (!isValidNFe) {
        return res.status(400).json({
          success: false,
          message: 'XML não é uma NF-e válida',
          errors: ['XML deve conter estrutura de Nota Fiscal Eletrônica']
        });
      }

      // Tentar fazer parse
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: true,
        explicitRoot: false,
        trim: true
      });

      const jsonResult = await parser.parseStringPromise(xml);
      const info = XMLController.extractBasicInfo(jsonResult);
      const totalProdutos = XMLController.countProducts(jsonResult);

      return res.status(200).json({
        success: true,
        message: 'XML de NF-e válido',
        data: {
          valido: true,
          chave: info.chave,
          numero: info.numero,
          emitente: info.nomeEmitente,
          totalProdutos: totalProdutos
        }
      });

    } catch (error) {
      logger.error('Erro ao validar NF-e:', error);
      return res.status(400).json({
        success: false,
        message: 'XML inválido',
        errors: ['Erro ao processar XML: ' + error.message]
      });
    }
  }
}

module.exports = XMLController; 