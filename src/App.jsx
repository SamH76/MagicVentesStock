import { useState } from "react";
import "./App.css";
import background from "./assets/image_accueil.png"; 

function App() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Connexion avec pseudo: ${pseudo}, mot de passe: ${password}`);
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${background})` }}>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de Passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">S’identifier</button>
      </form>
    </div>
  );
}

export default App;
