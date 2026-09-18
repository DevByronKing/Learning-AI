/**
 * Script de Teste e Homologação do Pix via Asaas (R$ 5,00)
 * Uso: node scripts/test_asaas_pix.js
 */

const asaasApiKey = process.env.ASAAS_API_KEY;
const isProduction = process.env.ASAAS_ENVIRONMENT === 'production';
const baseUrl = isProduction ? 'https://api.asaas.com/v3' : 'https://sandbox.asaas.com/api/v3';

async function testAsaasPix() {
  console.log('--- TESTE DE HOMOLOGAÇÃO PIX ASAAS ---');
  console.log(`Ambiente: ${isProduction ? 'PRODUÇÃO' : 'SANDBOX'}`);
  console.log(`Endpoint: ${baseUrl}`);

  if (!asaasApiKey) {
    console.log('⚠️ ASAAS_API_KEY não foi informada no ambiente.');
    console.log('Para testar a emissão real no Asaas, defina no .env.local:');
    console.log('ASAAS_API_KEY="$aact_YTU5YTE0M2M6..."\n');
    console.log('Gerando chave Pix simulada EMVCo de R$ 5,00 para teste do fluxo...');
    const txId = `teste_pix_${Date.now()}`;
    const code = `00020126580014br.gov.bcb.pix0136learning-ai-test-${txId}5204000053039865405.005802BR5914Learning AI6009Sao Paulo62070503***6304E8A9`;
    console.log(`✅ Pix Copia e Cola Gerado (R$ 5,00):\n${code}`);
    return;
  }

  try {
    console.log('1. Criando / Buscando cliente no Asaas...');
    const customerRes = await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: asaasApiKey,
      },
      body: JSON.stringify({
        name: 'Aluno Teste Homologação',
        email: 'teste@learningai.com.br',
      }),
    });
    const customer = await customerRes.json();
    console.log(`Cliente ID: ${customer.id}`);

    console.log('2. Criando cobrança Pix de R$ 5,00...');
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const paymentRes = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: asaasApiKey,
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: 'PIX',
        value: 5.0,
        dueDate,
        description: 'Learning AI - Teste de Homologação Pix R$ 5,00',
      }),
    });
    const payment = await paymentRes.json();
    console.log(`Cobrança criada com ID: ${payment.id}`);

    console.log('3. Obtendo QR Code e Copia e Cola...');
    const qrRes = await fetch(`${baseUrl}/payments/${payment.id}/pixQrCode`, {
      headers: { access_token: asaasApiKey },
    });
    const qrData = await qrRes.json();

    console.log('\n🎉 SUCESSO! Cobrança Pix Asaas gerada com sucesso:');
    console.log(`Transaction ID: ${payment.id}`);
    console.log(`Pix Copia e Cola: ${qrData.payload}`);
    console.log(`Expiração: ${qrData.expirationDate}`);
  } catch (err) {
    console.error('❌ Erro na integração com o Asaas:', err.message);
  }
}

testAsaasPix();
