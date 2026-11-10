import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  auth,
  browserSessionPersistence,
  googleProvider,
  isFirebaseConfigured,
} from "./firebase.js";

const destinations = [
  {
    name: "Porto de Galinhas",
    region: "Praia · Ipojuca",
    description: "Piscinas naturais, jangadas e um mar de águas cristalinas.",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
    alt: "Praia de águas azuis em Porto de Galinhas",
  },
  {
    name: "Olinda",
    region: "Cultura · Litoral norte",
    description: "Casarões coloridos, arte e ladeiras cheias de história.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    alt: "Arquitetura histórica colorida",
  },
  {
    name: "Praia dos Carneiros",
    region: "Praia · Tamandaré",
    description: "Coqueiros, mar tranquilo e paisagens inesquecíveis.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    alt: "Ondas suaves em uma praia tropical",
  },
  {
    name: "Garanhuns",
    region: "Natureza · Agreste",
    description: "Clima agradável, jardins e belas paisagens serranas.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
    alt: "Paisagem de montanhas e natureza",
  },
  {
    name: "Caruaru",
    region: "Cultura · Agreste",
    description: "Artesanato, feira popular e muito forró pé de serra.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
    alt: "Cidade iluminada ao entardecer",
  },
  {
    name: "Petrolina",
    region: "Natureza · Sertão",
    description: "Passeios pelo Rio São Francisco e vinícolas do sertão.",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80",
    alt: "Paisagem natural do interior",
  },
];

function LoginPanel() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!auth) return undefined;

    let unsubscribe;
    let isMounted = true;

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        if (isMounted) {
          unsubscribe = onAuthStateChanged(auth, setUser, (error) => {
            setMessage(`Não foi possível verificar o login: ${error.message}`);
          });
          setIsAuthReady(true);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setMessage(`Não foi possível iniciar o login: ${error.message}`);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  async function handleLogin() {
    if (!auth) return;

    setIsLoading(true);
    setMessage("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        setMessage(
          error.code === "auth/unauthorized-domain"
            ? "Domínio não autorizado no Firebase."
            : error.code === "auth/invalid-api-key" ||
                error.code === "auth/api-key-not-valid"
              ? "Chave do Firebase inválida. Confira a configuração em .env.local."
              : error.code === "auth/operation-not-allowed"
                ? "Login com Google desativado no Firebase."
                : `Não foi possível entrar com Google: ${error.message}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    if (!auth) return;

    setMessage("");
    try {
      await signOut(auth);
    } catch (error) {
      setMessage(`Não foi possível sair da conta: ${error.message}`);
    }
  }

  return (
    <section className="login-panel wrap" aria-label="Login com Google">
      <div className="login-copy">
        <h2>{user ? `Olá, ${user.displayName || user.email}` : "Acesse sua conta"}</h2>
      </div>
      {user ? (
        <div className="login-actions">
          {user.photoURL && (
            <img className="user-avatar" src={user.photoURL} alt="" />
          )}
          <button className="login-button secondary-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      ) : (
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={!isFirebaseConfigured || !isAuthReady || isLoading}
        >
          <span className="google-mark" aria-hidden="true">G</span>
          {!isFirebaseConfigured
            ? "Configure o Firebase"
            : isLoading
              ? "Aguarde..."
              : "Entrar com Google"}
        </button>
      )}
      <p className="login-message" role="status" aria-live="polite">
        {message ||
          (!isFirebaseConfigured
            ? "Preencha as variáveis do Firebase no arquivo .env.local para ativar o login."
            : "")}
      </p>
    </section>
  );
}

function Header() {
  return (
    <header className="site-header wrap">
      <a className="brand" href="#inicio">
        <span className="brand-mark" aria-hidden="true">
          PE
        </span>
        Pernambuco Turismo
      </a>
      <nav aria-label="Navegação principal">
        <a href="#destinos">Destinos</a>
        <a href="#sobre">Sobre</a>
        <a className="nav-button" href="#destinos">
          Planeje seu passeio
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-content">
        <p className="eyebrow">Um lugar para chamar de seu</p>
        <h1>
          Viva Pernambuco.
          <br />
          <span>Do seu jeito.</span>
        </h1>
        <p className="hero-copy">
          Mar azul, história viva e sabores que ficam na memória. Seu próximo
          passeio começa aqui.
        </p>
        <a className="button" href="#destinos">
          Conheça os destinos <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

function DestinationCard({ destination }) {
  return (
    <article className="card">
      <img src={destination.image} alt={destination.alt} loading="lazy" />
      <div className="card-body">
        <p className="card-type">{destination.region}</p>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
      </div>
    </article>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <LoginPanel />
        <Hero />
        <section className="intro wrap" id="destinos">
          <p className="eyebrow">Inspire-se para viajar</p>
          <h2>Um estado, muitos encantos</h2>
          <p>
            Da praia ao interior, Pernambuco tem sempre um lugar especial
            esperando por você.
          </p>
        </section>

        <section className="destinations wrap" aria-label="Destinos para conhecer">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.name}
              destination={destination}
            />
          ))}
        </section>

        <section className="closing" id="sobre">
          <h2>Partiu Pernambuco?</h2>
          <p>Escolha seu destino e aproveite cada momento da viagem.</p>
        </section>
      </main>
      <footer>
        <p>Pernambuco Turismo · Feito para inspirar sua próxima viagem.</p>
      </footer>
    </>
  );
}

export default App;
