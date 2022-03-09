// [{"nome": "Ademir Joãozinho", "idade": "22"},{"nome": "Rubens Isaque", "idade": "33"},{"nome": "Juvenal Adriana", "idade": "24"},{"nome": "Rubinho Veríssimo", "idade": "18"},{"nome": "Filipe Modesto", "idade": "45"}]

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_users')) ?? []
const setLocalStorage = (dbUsers) => localStorage.setItem("db_users", JSON.stringify(dbUsers))

// CRUD - CREATE READ UPDATE DELETE

const createUser = (usuario) => {
  const dbUsers = getLocalStorage()
  dbUsers.push(usuario)
  setLocalStorage(dbUsers)
}

const readUser = () => getLocalStorage()

const updateUser = (index, usuario) => {
  const dbUsers = readUser()
  dbUsers[index] = usuario
  setLocalStorage(dbUsers)
}

const deleteUser = (index) => {
  const dbUsers = readUser()
  dbUsers.splice(index, 1)
  setLocalStorage(dbUsers)
}

const validarCampos = () => {
  return document.getElementById('form').reportValidity()
}

// INTERAÇÃO COM O LAYOUT

const editarDeletar = (evento) => {
  if (evento.target.type == 'button') {

      const [action, index] = evento.target.id.split('-')

      if (action == 'editar') {
          editarUsuario(index)
      } else {
          const usuario = readUser()[index]
          const response = confirm(`Deseja realmente excluir o usuário ${usuario.nome}`)
          if (response) {
              deleteUser(index)
              atualizarTabela()
          }
      }
  }
}

const preencherCampos = (usuario) => {
  document.getElementById('nome').value = usuario.nome
  document.getElementById('idade').value = usuario.idade
  document.getElementById('nome').dataset.index = usuario.index
}

const limparCampos = () => {
  const fields = document.querySelectorAll('.campos-input')
  fields.forEach(field => field.value = "")
  document.getElementById('nome').dataset.index = 'new'
}

const editarUsuario = (index) => {
  const usuario = readUser()[index]
  usuario.index = index
  preencherCampos(usuario)
}

const criarLinha = (usuario, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
      <td>${usuario.nome}</td>
      <td>${usuario.idade}</td>
      <td>
          <button type="button" class="button yellow" id="editar-${index}">Editar</button>
          <button type="button" class="button red" id="deletar-${index}">Excluir</button>
      </td>
  `
  document.querySelector('.registros>tbody').appendChild(newRow)
}

const salvarUsuario = () => {
  // debugger
  if (validarCampos()) {
      const usuario = {
          nome: document.getElementById('nome').value,
          idade: document.getElementById('idade').value
      }
      const index = document.getElementById('nome').dataset.index
      if (index == 'novo') {
          createUser(usuario)
          atualizarTabela()
      } else {
          updateUser(index, usuario)
          atualizarTabela()
      }
  }
}

const limparTabela = () => {
    const rows = document.querySelectorAll('.registros>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

const atualizarTabela = () => {
  // debugger
  const dbClient = readUser()
  limparTabela();
  dbClient.forEach(criarLinha);
  adicionarEventos()
}

// EVENTOS

const adicionarEventos = () => {
  botoes = document.querySelectorAll('.registros>tbody>tr>td>button');
  botoes.forEach(botao => {
    botao.addEventListener('click', editarDeletar)
  })
}

document.getElementById('salvar').addEventListener('click', salvarUsuario)

// INICIALIZAÇÃO

atualizarTabela();
adicionarEventos();