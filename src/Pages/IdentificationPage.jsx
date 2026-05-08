import { useState } from "react";
import { identifierUtilisateur } from "../apiService/IdentificationService";
import "../style/App.css";
import background from "../assets/image_accueil.png";

function IdentificationPage({ onAuthenticated }) {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const user = await identifierUtilisateur(pseudo, password);
      onAuthenticated(user);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(event) => setPseudo(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "S'identifier"}
        </button>

        {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : null}
      </form>
    </div>
  );
}

export default IdentificationPage;
