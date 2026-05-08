import { useCallback, useEffect, useMemo, useState } from 'react'
import { recupererProduitDuJour } from '../apiService/ProduitService'
import {
  ajouterProduitAuPanier,
  recupererPanierUtilisateur,
} from '../apiService/PanierService'
import '../style/App.css'
import logo from '../assets/logo.png'

function AccueilPage({ user, onLogout }) {
  const [dailyData, setDailyData] = useState(null)
  const [quantite, setQuantite] = useState(1)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [panier, setPanier] = useState({})
  const [isLoadingPanier, setIsLoadingPanier] = useState(true)
  const [panierError, setPanierError] = useState('')

  useEffect(() => {
    const chargerProduitDuJour = async () => {
      setErrorMessage('')
      setIsLoadingProduct(true)

      try {
        const response = await recupererProduitDuJour()
        setDailyData(response)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoadingProduct(false)
      }
    }

    chargerProduitDuJour()
  }, [])

  const stockDisponible = useMemo(
    () => Number(dailyData?.quantiteDisponible ?? 0),
    [dailyData],
  )

  const prixTotal = useMemo(
    () => (dailyData ? dailyData.produit.prix * quantite : 0),
    [dailyData, quantite],
  )

  const lignesPanier = useMemo(() => Object.entries(panier), [panier])

  const totalArticlesPanier = useMemo(
    () => lignesPanier.reduce((total, [, quantity]) => total + Number(quantity), 0),
    [lignesPanier],
  )

  const chargerPanier = useCallback(async () => {
    setPanierError('')
    setIsLoadingPanier(true)

    try {
      const response = await recupererPanierUtilisateur(user.userId)
      setPanier(response)
    } catch (error) {
      setPanier({})
      setPanierError(error.message)
    } finally {
      setIsLoadingPanier(false)
    }
  }, [user.userId])

  useEffect(() => {
    chargerPanier()
  }, [chargerPanier])

  const handleAddToCart = async () => {
    if (!dailyData) {
      return
    }

    setErrorMessage('')
    setSuccessMessage('')

    if (!Number.isInteger(quantite) || quantite < 1) {
      setErrorMessage('La quantite doit etre un entier superieur ou egal a 1.')
      return
    }

    if (quantite > stockDisponible) {
      setErrorMessage(`La quantite doit etre inferieure ou egale a ${stockDisponible}.`)
      return
    }

    setIsAddingToCart(true)

    try {
      await ajouterProduitAuPanier(user.userId, dailyData.produit.produitId, quantite)
      await chargerPanier()
      setSuccessMessage('Produit ajoute au panier avec succes.')
      setQuantite(1)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="accueil-page">
      <header className="accueil-header">
        <div className="header-brand">
          <img src={logo} alt="Logo Magic Ventes & Stock" className="app-logo" />
          <h1>Magic Ventes & Stock</h1>
        </div>
        <div className="header-user">
          <p className="user-greeting">Bonjour, <strong>{user.prenom} {user.nom}</strong></p>
          <p className="user-pseudo">@{user.pseudo}</p>
        </div>
        <button type="button" className="logout-button" onClick={onLogout}>
          Déconnexion
        </button>
      </header>

      <main className="accueil-container">
        <div className="accueil-content">
          <section className="product-section">
            <div className="section-header">
              <h2>🎁 Produit du Jour</h2>
              <span className="section-subtitle">Offre spéciale</span>
            </div>

            {isLoadingProduct ? (
              <div className="loading-state">
                <p>Chargement du produit du jour...</p>
              </div>
            ) : null}

            {!isLoadingProduct && dailyData ? (
              <div className="product-card">
                <div className="product-header">
                  <h3>{dailyData.produit.nom}</h3>
                  <span
                    className={`stock-badge ${stockDisponible > 0 ? 'in-stock' : 'out-of-stock'}`}
                  >
                    {stockDisponible > 0 ? `${stockDisponible} en stock` : 'Rupture'}
                  </span>
                </div>

                <div className="product-price">
                  <span className="price-label">Prix unitaire</span>
                  <span className="price-value">{dailyData.produit.prix.toFixed(2)} €</span>
                </div>

                <div className="quantity-section">
                  <label htmlFor="quantite">Quantité</label>
                  <div className="quantity-input-group">
                    <input
                      id="quantite"
                      type="number"
                      min="1"
                      max={stockDisponible}
                      value={quantite}
                      onChange={(event) => setQuantite(Number(event.target.value))}
                      disabled={stockDisponible < 1}
                    />
                    <span className="quantity-hint">max: {stockDisponible}</span>
                  </div>
                </div>

                <div className="price-total">
                  <span>Total</span>
                  <span className="total-value">{prixTotal.toFixed(2)} €</span>
                </div>

                <button
                  type="button"
                  className="btn-add-cart"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || stockDisponible < 1}
                >
                  {isAddingToCart ? (
                    <>
                      <span className="spinner"></span> Ajout en cours
                    </>
                  ) : (
                    <>🛒 Ajouter au panier</>
                  )}
                </button>

                {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
                {successMessage ? <p className="success-message">{successMessage}</p> : null}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="accueil-sidebar">
          <div className="sidebar-card">
            <h3>📊 Infos Session</h3>
            <div className="info-item">
              <span className="info-label">Utilisateur</span>
              <span className="info-value">{user.prenom} {user.nom}</span>
            </div>

            <div className="panier-block">
              <div className="panier-title-row">
                <span className="info-label">Panier</span>
                <span className="panier-total">{totalArticlesPanier} article(s)</span>
              </div>

              {isLoadingPanier ? <p className="panier-state">Chargement du panier...</p> : null}
              {panierError ? <p className="error-message panier-error">{panierError}</p> : null}

              {!isLoadingPanier && !panierError && lignesPanier.length === 0 ? (
                <p className="panier-state">Votre panier est vide.</p>
              ) : null}

              {!isLoadingPanier && !panierError && lignesPanier.length > 0 ? (
                <div className="panier-list">
                  {lignesPanier.map(([nomProduit, quantiteProduit]) => (
                    <div className="panier-item" key={nomProduit}>
                      <span className="panier-product">{nomProduit}</span>
                      <span className="panier-quantity">x{quantiteProduit}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default AccueilPage
