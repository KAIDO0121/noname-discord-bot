const axios = require('axios');

module.exports = {
    monitorHelper: async ({ block_number }) => {
        try {
            const res = await axios.get(`https://deep-index.moralis.io/api/v2/block/${block_number}/nft/transfers?chain=eth&limit=${9}`, {
                headers: {
                    'X-API-KEY': 'OfUSc5bimPJiWEfOIKKoar7SXzdFKyqbWwNCQkPpSfM4t4x5cEW0GCA81dwMFGai'
                }
            })
            return res.data.result
        } catch (error) {
            return error
        }
    }
}