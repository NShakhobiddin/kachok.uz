// Topilmagan sahifa: o'lik nuqta bo'lmasin — doim bosh sahifaga yo'l bor.
import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';

export function NotFound({ text }: { text: string }) {
  return (
    <div className="page empty stack gap-12" style={{ alignItems: 'center' }}>
      <h1 className="title">{text}</h1>
      <Link to="/" className="btn btn-primary">
        <Icon name="home" size={18} /> Bosh sahifaga
      </Link>
    </div>
  );
}
