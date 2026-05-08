const API_BASE_URL = ''

export async function ajouterProduitAuPanier(userId, produitId, quantite) {
  const queryParams = new URLSearchParams({
    userId,
    produitId,
    quantite: String(quantite),
  })

  const response = await fetch(
    `${API_BASE_URL}/api/panier/ajouter?${queryParams.toString()}`,
    {
      method: 'POST',
    },
  )

  if (!response.ok) {
    throw new Error('Impossible d\'ajouter le produit au panier.')
  }

  return true
}

export async function recupererPanierUtilisateur(userId) {
  const response = await fetch(`${API_BASE_URL}/api/panier/${userId}`)

  if (!response.ok) {
    throw new Error('Impossible de recuperer le panier utilisateur.')
  }

  const payload = await response.json()
  return payload ?? {}
}

