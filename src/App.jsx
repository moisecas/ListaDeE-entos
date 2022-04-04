
import React from 'react';
import {firebase} from './firebase'

function App() {

  const [tareas, setTareas] = React.useState([]) //para eso creamos los useState, para mostrar los datos en la página 
  const [tarea, setTarea] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false) //comienza en falso, cada vez que sea verdadero lo vamos a transformar
  const [id, setId] = React.useState('')


  React.useEffect(() => { //petición a firebase, permanente revisión, puede crear loops innecesarios 

    const obtenerDatos = async () => { //esta constante se crea para evitar un loop

      try {

        const db = firebase.firestore()
        const data = await db.collection('tareas').get() //se llama al nombre de colección dentro de la base de datos, petición a firestore y esta devolviendo 
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() })) //{armando objetos}, va a traer todos los documentos de tarea, loop de data.docs, vamos a mapear todo lo que venga de data
        // los ... se usan para acceder a esa info, {} el contenido coincide con los documentos de la colección
        console.log(arrayData)
        setTareas(arrayData)
        
      } catch (error) {
        console.log(error)
      }

    }

    obtenerDatos()

  }, [])

  const agregar = async (e) => { //función agregar 
    e.preventDefault()

    if(!tarea.trim()){ //validar
      console.log('está vacio')
      return
    }

    try { //try y catch, siempre va con una fución async, en el try va toda nuestra lógica 

      const db = firebase.firestore() //llamamos al a la base de datos 
      const nuevaTarea = { //campos que vamos a agregar, se deben relacionar con los creados en la base de datos 
        name: tarea,
        fecha: Date.now()
      }
      const data = await db.collection('tareas').add(nuevaTarea) //el add recibe el objeto, con el add el id será aleatorio

      setTareas([ //... copia del array y crear el nuevo objeto 
        ...tareas,
        {...nuevaTarea, id: data.id} //accedemos a la información 
      ])

      setTarea('')
      
    } catch (error) {
      console.log(error)
    }

    console.log(tarea)
  }

  const eliminar = async (id) => { //función de flecha, async 
    try { 
      
      const db = firebase.firestore()//llamado a firebase 
      await db.collection('tareas').doc(id).delete() //especificar el id que se pasa a traves del documento 

      const arrayFiltrado = tareas.filter(item => item.id !== id) //va a filtrar lo que deseamos eliminar 
      setTareas(arrayFiltrado) //va el array filtrado el cual no va a tener nuestra tarea eliminada 

    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id) //para que en el formulario aparezca la tarea que vamos a editar 
  }

  const editar = async (e) => { //recibe ub evento 
    e.preventDefault()
    if(!tarea.trim()){
      console.log('vacio')
      return
    }
    try {
      
      const db = firebase.firestore()
      await db.collection('tareas').doc(id).update({ //va a recibir un objeto con el campo que vamos a actualizar 
        name: tarea
      })
      const arrayEditado = tareas.map(item => ( //iterar las tareas 
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item //cuado esto sea verdadero vamos a devolver un objeto
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')
    } catch (error) {
      console.log(error)
    }
  }

  return ( //los datos mostrados en la página 
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6"> 
          <h3>Lista de Eventos por autorizar</h3>
          <ul className="list-group">
            {
              tareas.map(item => (//llamado a tareas, iterar sobre la base de datos 
                <li className="list-group-item" key={item.id}>
                  {item.name}
                  <button 
                    className="btn btn-danger btn-sm float-right"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                  <button 
                    className="btn btn-warning btn-sm float-right mr-2"
                    onClick={() => activarEdicion(item)}
                  >
                    Editar
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar evento' : 'Agregar evento'
            }
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
            <input 
              type="textarea" 
              placeholder="Ingrese evento"
              className="form-control mb-2"
              onChange={e => setTarea(e.target.value)}
              value={tarea}
            />
            <button 
              className={
                modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
              }
              type="submit"
            >
              {
                modoEdicion ? 'Editar' : 'Agregar' //cuando sea verdadero editar y cuando sea falso agregar 
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
