export default function Layout({children}) {
  return(
  <>
  <header>
    <nav>navBar</nav>
    <div>logo</div>
  </header>

  <section>{children}</section>
  <footer>


    <h1>gooter</h1>
  </footer>
  </>
  )
}
