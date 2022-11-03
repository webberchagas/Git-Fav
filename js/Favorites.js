import { GithubUser } from "./GithubUser.js"

export class Favorite {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem("@github-fav:")) || []
  }

  save(){
    localStorage.setItem("@github-fav:", JSON.stringify(this.entries))
  }

  async add(username){
    try {
      const userExists = this.entries.find( entry => username.toUpperCase() ===  entry.login.toUpperCase())
      
      if(userExists){
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)
      
      if( user.login === undefined){
        throw new Error('Usuário não existe!')
      }
    
      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error){
      alert(error.message)
    }
    
  }

  delete(user){
    this.entries = this.entries.filter( entry => entry.login !== user.login)
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorite {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')
  
    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('#favorite')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('#search')
      this.add(value)
    }
  }

  update(){
    this.removeAllTr()

    this.exchangeTableBg()

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent =`@${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const itsOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(itsOk){
          this.delete(user)
        }
      }
      
      this.tbody.append(row)
    })
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/maykbrito.png" alt="Imagem do Mayk">
          <a href="https://github.com/maykbrito" target="_blank">
            <p>Mayk Brito</p>
            <span>@maykbrito</span>
          </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td>
          <button class="remove">Remover</button>
        </td>
    `

    return tr
  }

  removeAllTr(){
    this.tbody.querySelectorAll('tr').forEach( tr => tr.remove())  
  }


  exchangeTableBg(){
    const isEmpty = this.entries.length === 0
    
    const removeClass = () => { this.footer = this.root.querySelector('.footer').classList.remove('hide')} 
    
    const addClass = () => {this.footer = this.root.querySelector('.footer').classList.add('hide')}

    const exchangeTableBg = isEmpty ?  removeClass() : addClass()
  }
}