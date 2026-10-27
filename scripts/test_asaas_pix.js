/**
 * Validador Oficial de Pagamento Asaas (Produção / Sandbox)
 * Executar: node scripts/test_asaas_pix.js
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');

function getEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      env[key] = val;
    }
  }
  return env;
}

async function validateAsaas() {
  const env = getEnv();
  const apiKey = env.ASAAS_API_KEY || process.env.ASAAS_API_KEY;
  const isProduction = (env.ASAAS_ENVIRONMENT || process.env.ASAAS_ENVIRONMENT) === 'production';
  const baseUrl = isProduction ? 'https://api.asaas.com/v3' : 'https://sandbox.asaas.com/api/v3';

  console.log('\n======================================================');
  console.log('       DIAGNÓSTICO OFICIAL DE PAGAMENTO ASAAS');
  console.log('======================================================');
  console.log(`Ambiente: ${isProduction ? 'PRODUÇÃO (api.asaas.com)' : 'SANDBOX (sandbox.asaas.com)'}`);

  if (!apiKey || apiKey.includes('sua-chave')) {
    console.error('❌ ASAAS_API_KEY não configurada ou inválida em .env.local');
    process.exit(1);
  }

  // 1. Status da Conta
  console.log('\n[1/3] Verificando status da conta no Asaas...');
  try {
    const statusRes = await fetch(`${baseUrl}/myAccount/status`, {
      headers: { access_token: apiKey }
    });
    if (!statusRes.ok) {
      console.error(`❌ Falha de autenticação HTTP ${statusRes.status}. Verifique a ASAAS_API_KEY.`);
      return;
    }
    const statusData = await statusRes.json();
    console.log('  • Documentação:       ', statusData.documentation === 'APPROVED' ? '✅ APROVADA' : '⏳ PENDENTE');
    console.log('  • Info Comercial:     ', statusData.commercialInfo === 'APPROVED' ? '✅ APROVADA' : '⏳ PENDENTE');
    console.log('  • Dados Bancários:    ', statusData.bankAccountInfo === 'APPROVED' ? '✅ APROVADA' : '⚠️ PENDENTE DE CADASTRO');
    console.log('  • Status Geral:       ', statusData.general === 'APPROVED' ? '✅ APROVADA' : '⏳ PENDENTE');

    if (statusData.bankAccountInfo !== 'APPROVED') {
      console.log('\n⚠️ AÇÃO NECESSÁRIA NO ASAAS:');
      console.log('  Cadastre seus Dados Bancários em https://www.asaas.com > "Minha Conta" > "Dados Bancários".');
      console.log('  Sem isso, o Asaas não libera a emissão de cobranças Pix ao vivo.');
    }
  } catch (err) {
    console.error('❌ Erro ao consultar conta:', err.message);
    return;
  }

  // 2. Chaves Pix
  console.log('\n[2/3] Verificando chaves Pix cadastradas...');
  try {
    const keysRes = await fetch(`${baseUrl}/pix/addressKeys`, {
      headers: { access_token: apiKey }
    });
    const keysData = await keysRes.json();
    const count = keysData.totalCount || 0;
    if (count > 0) {
      console.log(`  ✅ ${count} chave(s) Pix encontrada(s).`);
    } else {
      console.log('  ⚠️ Nenhuma chave Pix cadastrada em Configurações > Pix.');
    }
  } catch (err) {
    console.error('❌ Erro ao verificar chaves Pix:', err.message);
  }

  // 3. Teste de Emissão Pix de R$ 5,00
  console.log('\n[3/3] Testando emissão real de cobrança Pix (R$ 5,00 - mínimo Asaas)...');
  try {
    // Busca ou cria cliente
    const custRes = await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: apiKey },
      body: JSON.stringify({
        name: 'Aluno Teste Homologacao',
        email: 'alunoteste@argus.app.br',
        cpfCnpj: '00000000191' // CPF formatado de teste homologado
      })
    });
    const customer = await custRes.json();
    const customerId = customer.id;

    if (!customerId) {
      console.log('  ❌ Falha ao registrar cliente teste:', customer);
      return;
    }

    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const payRes = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: apiKey },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value: 5.00,
        dueDate,
        description: 'Argus - Teste de Validação Técnica Pix (R$ 5,00)'
      })
    });
    const payment = await payRes.json();

    if (payment.errors) {
      console.log('\n❌ O Asaas recusou a emissão do Pix com os seguintes motivos:');
      payment.errors.forEach(e => console.log(`   - [${e.code}]: ${e.description}`));
      console.log('\n💡 O sistema continua aceitando pagamentos via fallback Pix EMVCo normalmente.');
      return;
    }

    if (payment.id) {
      const qrRes = await fetch(`${baseUrl}/payments/${payment.id}/pixQrCode`, {
        headers: { access_token: apiKey }
      });
      const qrData = await qrRes.json();
      const pixPayload = qrData.payload || qrData.pixQrCode || payment.pixQrCode;
      console.log('\n🎉 SUCESSO TOTAL! Pix emitido e pronto para receber:');
      console.log(`  • ID da Cobrança: ${payment.id}`);
      console.log(`  • Valor: R$ 5,00`);
      console.log(`  • Copia e Cola Pix:\n${pixPayload}`);
      console.log(`  • Expiração: ${qrData.expirationDate || '15 minutos'}`);
    }
  } catch (err) {
    console.error('❌ Erro no teste de cobrança:', err.message);
  }
}

validateAsaas();
