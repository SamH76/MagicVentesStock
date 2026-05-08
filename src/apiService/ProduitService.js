const API_BASE_URL = ''

export async function recupererProduitDuJour() {
  const response = await fetch(`${API_BASE_URL}/api/produits/dailyProduct`)

  if (!response.ok) {
    throw new Error('Impossible de recuperer le produit du jour.')
  }

  return response.json()
}

