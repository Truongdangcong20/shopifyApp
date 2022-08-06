import axios from 'axios';

export function LogoutButton(props) {
  const logout = () => {
    axios.post('/account/logout').then(() => {
      if (typeof props?.onClick === 'function') {
        props.onClick();
      }
      window.location.href = '/';
    });
  };

  return (
    <button className="text-primary/50" {...props} onClick={logout}>
      Logout
    </button>
  );
}
