import React from 'react';

const Introduccion = () => (
  <div className="seccion">
    <h2>Introducción a Punteros</h2>
    <div className="card">
      <h3>¿Qué son los punteros?</h3>
      <p>
        Un <strong>puntero</strong> es una variable que almacena la dirección de memoria de otra variable. 
        A diferencia de Java, donde las referencias a objetos son implícitas, C++ permite manipular
        directamente direcciones de memoria.
      </p>

      <div className="comparacion">
        <div className="java">
          <h4>En Java:</h4>
          <pre>
            {`String texto = "Hola";
// La variable texto es una referencia implícita
// No puedes acceder a su dirección de memoria`}
          </pre>
        </div>
        <div className="cpp">
          <h4>En C++:</h4>
          <pre>
            {`std::string texto = "Hola";
// Variable normal
std::string* ptr = &texto;
// ptr almacena la dirección de memoria de texto`}
          </pre>
        </div>
      </div>

      <h3>¿Por qué aprender punteros?</h3>
      <ul>
        <li>Permiten gestionar la memoria de forma eficiente</li>
        <li>Son necesarios para estructuras de datos dinámicas</li>
        <li>Posibilitan operaciones de bajo nivel imposibles en Java</li>
        <li>Son fundamentales en muchas APIs y bibliotecas de C++</li>
      </ul>

      <h3>Diferencias clave con Java</h3>
      <table className="tabla-comparativa">
        <thead>
          <tr>
            <th>Java</th>
            <th>C++</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gestión automática de memoria (Garbage Collection)</td>
            <td>Gestión manual de memoria (new/delete)</td>
          </tr>
          <tr>
            <td>Referencias implícitas a objetos</td>
            <td>Punteros explícitos con operadores & y *</td>
          </tr>
          <tr>
            <td>No hay aritmética de punteros</td>
            <td>Aritmética de punteros permitida</td>
          </tr>
          <tr>
            <td>No hay punteros a funciones (usa interfaces)</td>
            <td>Punteros a funciones disponibles</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default Introduccion; 