import MainNav from './MainNav';
import ClientOnly from './ClientOnly'; 

export default function Layout(props) {
  return (
    <>
      <ClientOnly>
        <MainNav />
      </ClientOnly>
      <main className="container">
        {props.children}
      </main>
    </>
  );
}
