import './App.scss';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface Contact {
  first: string,
  last: string,
  email: string,
  cell: string,
  code: number,
  country: string,
  id: number
}

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [favs, setFavs] = useState<Contact[]>([]);
  const [results, setResults] = useState<Contact[]>([]);
  const [clickCounter, setClickCounter] = useState<number>(1);

  function capitalizeFirstLetter(string: string) 
{
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatPhoneNumber(phoneNumberString: string) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
}

  const add = async () => {
    let first = (document.getElementById('fName')! as HTMLInputElement).value;
    let last = (document.getElementById('lName')! as HTMLInputElement).value;
    let email = (document.getElementById('email')! as HTMLInputElement).value;
    let cellphone = (document.getElementById('cellphone')! as HTMLInputElement).value;
    let country_ = (document.getElementById('country')! as HTMLInputElement).value;
    if(first === '' || last === '' || cellphone === '' || country_ === ''){
      alert("First & Last Name, Cell Phone and Country cannot be blank");
    } else if(cellphone.length !== 10){
      alert("Invalid Phone Number");
    } else {
    let country = "";
    let code: number = 0;
    let d: any = [];
    let id: number  = Math.random();
    await fetch('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json')
  .then(response => response.json())
  .then(data => d = data);

  for(let i=0; i<d.length; i++){
    let name = d[i].name;
    if(name === capitalizeFirstLetter(country_)){
      code = d[i].dial_code;
      country = d[i].code;
    }
  }
  if(email === ''){
    email = "None"
  }
  setContacts([...contacts, {first: first, last: last, email: email, cell: cellphone, code: code, country: country, id: id}]);
  document.getElementById("addModal")!.style.display="none";
}
  }

  const addFavorite = (contactId: number, first: string, last: string, email: string, cellphone: string, code: number, country: string): void => {
    let id = contactId + 'favButton';
    let button = document.getElementById(id)!;
    if(button.style.color==="tomato"){
      button.style.color="gray";
      setFavs(favs.filter((c)=>{
        return c.id !== contactId;
      }))
    } else {
      setFavs([...favs, {first: first, last: last, email: email, cell: cellphone, code: code, country: country, id: contactId}]); 
      button.style.color="tomato";
    }
  }

  const search = () => {
    let input = (document.getElementById('searchInput')! as HTMLInputElement).value;
    setClickCounter(clickCounter + 1);
    if(clickCounter === 1){
      setResults(contacts);
    }
    if(input !== ''){
      setContacts(results.filter((contact)=>{
        return contact.first === input.toLowerCase();
      }));
    } else {
      setContacts(results);
    }
  }
  
  return (
    <div className="App">
      <nav>
        <h1 style={{cursor: "pointer"}}>Phone Book</h1>
        <input id="searchInput" style={{height: "25px", width: "30%", marginTop: "20px", outline: "none"}} />
        <SearchIcon className="searchIcon" onClick={search} />
        <MenuIcon onClick={()=>{document.getElementById('menu')!.style.display="block"}} className="menuIcon" />
      </nav>

    <div id="favModal" className="favModal">
  <div className="favs-content">
    <span onClick={()=>{document.getElementById('favModal')!.style.display="none"}} className="favModuleClose">&times;</span>
    <h2>Favorites</h2>
    {favs.map((contact)=>{
      return <>
      <div id={(contact.id).toString()} className="listModal">
      <div className="listModal-content">
      <span className="closeListModal" onClick={()=>{document.getElementById((contact.id).toString())!.style.display="none"}}>&times;</span>
        <ul>
        <li>Name: {capitalizeFirstLetter(contact.first)}</li>
        <li>Last Name: {capitalizeFirstLetter(contact.last)}</li>
        <li>Phone Number: {contact.code + " " + formatPhoneNumber(contact.cell)!}</li>
        <li>Email: {(contact.email).toLowerCase()}</li>
        </ul>
      </div>
    </div>
    <div className="list">
      <h3 onClick={()=>{document.getElementById((contact.id).toString())!.style.display="block"}}>{capitalizeFirstLetter(contact.first)} {capitalizeFirstLetter(contact.last)}</h3>
      <div className="buttons">
      <DeleteForeverIcon className="deleteButton" onClick={()=>{
        setFavs(favs.filter((c)=>{
          return c.id !== contact.id;
        }));
        let button = document.getElementById(contact.id + 'favButton')!;
        button.style.color="gray";
      }} />
      </div>
      <p style={{position: "relative", left: "500px", top: "5px"}}>{contact.code + " " + formatPhoneNumber(contact.cell)!}</p>
      <p style={{position: "relative", left: "1000px", top: "5px"}}>{contact.country}</p>
    </div>
    </>
    })}
  </div>
</div>

      <div id="addModal" className="addModal">

  <div className="modal-content">
    <span className="close" onClick={()=>{document.getElementById("addModal")!.style.display="none"}}>&times;</span>
    <input id="fName" placeholder="First Name" type="text" style={{position: "relative", left: "10px"}}/>
    <br/>
    <input id="lName" placeholder="Last Name" type="text"/>
    <br/>
    <input id="email" placeholder="Email (optional)" type="email"/>
    <br/>
    <input id="cellphone" placeholder="Cell Phone" type="number" min="0"/>
    <br/>
    <input id="country" placeholder="Country" type="text" min="0"/>
    <br/>
    <button onClick={add} className="addContact">Add</button>
  </div>

</div>
      <div className="container">
        {
          contacts.map((contact)=>{
            return <>
            <div id={(contact.id).toString()} className="listModal">
            <div className="listModal-content">
            <span className="closeListModal" onClick={()=>{document.getElementById((contact.id).toString())!.style.display="none"}}>&times;</span>
              <ul>
              <li>Name: {capitalizeFirstLetter(contact.first)}</li>
              <li>Last Name: {capitalizeFirstLetter(contact.last)}</li>
              <li>Phone Number: {contact.code + " " + formatPhoneNumber(contact.cell)!}</li>
              <li>Email: {(contact.email).toLowerCase()}</li>
              </ul>
            </div>
          </div>
          <div className="list">
            <h3 onClick={()=>{document.getElementById((contact.id).toString())!.style.display="block"}}>{capitalizeFirstLetter(contact.first)} {capitalizeFirstLetter(contact.last)}</h3>
            <div className="buttons">
            <DeleteForeverIcon className="deleteButton" onClick={()=>{
              setContacts(contacts.filter((c)=>{
                return c.id !== contact.id;
              }))
            }} />
            <FavoriteIcon className="favoriteButton" id={(contact.id).toString() + 'favButton'} onClick={()=>{addFavorite(contact.id, contact.first, contact.last, contact.email, contact.cell, contact.code, contact.country)}} />
            </div>
            <p style={{position: "relative", left: "500px", top: "5px"}}>{contact.code + " " + formatPhoneNumber(contact.cell)!}</p>
            <p style={{position: "relative", left: "1000px", top: "5px"}}>{contact.country}</p>
          </div>
          </>
          })
        }
        </div>
      <div id="menu" className="menu">
        <span onClick={()=>{document.getElementById('menu')!.style.display="none"}}>&times;</span>
        <br/><br/>
        <ul>
          <li onClick={()=>{document.getElementById('favModal')!.style.display="block"}}>Favorites</li>
          <li onClick={()=>{alert("Organize all your contacts in one place easily!")}}>About</li>
          <li onClick={()=>{alert("v1.0")}}>Version</li>
        </ul>
      </div>
      <AddCircleIcon className="addIcon" onClick={()=>{document.getElementById("addModal")!.style.display="block"}}/>
    </div>
  );
}

export default App;