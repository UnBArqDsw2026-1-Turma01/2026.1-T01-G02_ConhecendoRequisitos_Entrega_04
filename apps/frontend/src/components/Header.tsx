import "./Header.css";

type HeaderProps = {
  isLoggedIn: boolean;
};

export function Header({ isLoggedIn }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-box">
          <span className="logo-check">✓</span>
        </div>
        <span className="logo-text">CR</span>
      </div>

      <nav className="header-icons">
        {isLoggedIn && (
          <button className="icon-button" aria-label="Trilhas">
            <BookIcon />
          </button>
        )}

        <button className="icon-button" aria-label="Perfil">
          <UserIcon />
        </button>

        {isLoggedIn && (
          <button className="icon-button" aria-label="Sair">
            <LogoutIcon />
          </button>
        )}
      </nav>
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
      <path
        d="M4 21C4 17 7.5 14 12 14C16.5 14 20 17 20 21"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5H10C11.1 5 12 5.9 12 7V19C12 17.9 11.1 17 10 17H4V5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 5H14C12.9 5 12 5.9 12 7V19C12 17.9 12.9 17 14 17H20V5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 17L15 12L10 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12H3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}