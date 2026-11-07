import { Heart } from './icons/Icons';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__script">Always, yours.</p>
        <p className="footer__note">
          <Heart /> Made with love for your birthday <Heart />
        </p>
        <a href="#home" className="footer__back">
          Back to the beginning
        </a>
      </div>
    </footer>
  );
}
