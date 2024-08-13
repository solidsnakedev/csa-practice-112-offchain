
// get all the utxos
// filter right datum
// return [readable_utxo]


// front_end and to be use with buyNFT

const query = () => 

const allUserContractUtxos = allContractUtxos.filter(async (value) => {
  if (value.datum) {
    try {
      const datum = Data.from(value.datum, SimpleSaleDatum);
      const price_equal =  datum.priceOfAsset = buyNFTConfig.priceOfAsset;
      const same_addr = datum.sellerAddress === fromAddress(await buyNFTConfig.lucid.wallet().address());
      return price_equal && same_addr
    } catch (_) {
      return false;
    }
  } else {
    return false;
  }
});