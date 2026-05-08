const API_BASE_URL = ''

export async function identifierUtilisateur(pseudo, password) {
  const response = await fetch(`${API_BASE_URL}/api/utilisateurs/Identifier`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pseudo, password }),
  })

  if (!response.ok) {
    throw new Error('Authentification echouee. Verifiez vos identifiants.')
  }

  return response.json()
}

