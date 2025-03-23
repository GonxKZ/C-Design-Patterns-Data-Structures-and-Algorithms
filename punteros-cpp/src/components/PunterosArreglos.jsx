import React from 'react';

const PunterosArreglos = () => (
  <div className="seccion">
    <h2>Punteros y Arreglos</h2>

    <div className="card">
      <h3>Relación entre Arreglos y Punteros</h3>
      <p>
        En C++, existe una estrecha relación entre arreglos y punteros. Un arreglo 
        puede decaer (convertirse implícitamente) en un puntero a su primer elemento.
      </p>

      <div className="code-example">
        <pre>
          {`int numeros[5] = {10, 20, 30, 40, 50};

// Un nombre de arreglo decae en un puntero al primer elemento
int* p = numeros;  // Equivalente a: int* p = &numeros[0];

// Ambas formas son válidas para acceder a elementos
cout << numeros[0] << endl;  // Usando notación de arreglo: 10
cout << *p << endl;          // Usando notación de puntero: 10

// Avanzando por el arreglo
cout << numeros[2] << endl;  // Usando índice: 30
cout << *(p + 2) << endl;    // Usando aritmética de punteros: 30`}
        </pre>
      </div>

      <div className="importante">
        <p><strong>Importante:</strong> Aunque son similares, un arreglo no es exactamente lo mismo que un puntero:
          <ul>
            <li>Un arreglo representa un bloque contiguo de memoria</li>
            <li>No puedes reasignar un nombre de arreglo a otra dirección</li>
            <li>sizeof(arreglo) devuelve el tamaño total del arreglo, mientras que sizeof(puntero) devuelve el tamaño de la dirección</li>
          </ul>
        </p>
      </div>
    </div>

    <div className="card">
      <h3>Recorriendo Arreglos con Punteros</h3>
      <p>
        Una aplicación común de los punteros es recorrer arreglos de forma eficiente.
      </p>

      <div className="code-example">
        <pre>
          {`int valores[5] = {1, 2, 3, 4, 5};

// Método 1: Recorrido con índices
for (int i = 0; i < 5; i++) {
    cout << valores[i] << " ";  // Imprime: 1 2 3 4 5
}
cout << endl;

// Método 2: Recorrido con punteros (forma explícita)
for (int* p = valores; p < valores + 5; p++) {
    cout << *p << " ";         // Imprime: 1 2 3 4 5
}
cout << endl;

// Método 3: En C++ moderno, usa for basado en rango
for (int valor : valores) {
    cout << valor << " ";      // Imprime: 1 2 3 4 5
}
cout << endl;`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Punteros a Arreglos Multidimensionales</h3>
      <p>
        Los arreglos multidimensionales en C++ son en realidad arreglos de arreglos, lo que afecta a 
        cómo se declaran los punteros correspondientes.
      </p>

      <div className="code-example">
        <pre>
          {`// Arreglo bidimensional 3x4
int matriz[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

// Puntero a la primera fila (un arreglo de 4 ints)
int (*pFila)[4] = matriz;  // El paréntesis es necesario por precedencia

// Acceso a elementos
cout << matriz[1][2] << endl;       // Usando índices: 7
cout << *(*(pFila + 1) + 2) << endl; // Usando punteros: 7

// Puntero a puntero (para recorrer elemento por elemento)
int* pElemento = &matriz[0][0];
for (int i = 0; i < 3 * 4; i++) {
    cout << *pElemento << " ";      // Recorre todos los elementos
    pElemento++;
}
// Imprime: 1 2 3 4 5 6 7 8 9 10 11 12`}
        </pre>
      </div>

      <div className="nota">
        <p><strong>Nota:</strong> Trabajar con arreglos multidimensionales y punteros puede ser confuso.
        En C++ moderno, considera usar contenedores como <code>std::vector</code> o <code>std::array</code> 
        para mayor claridad y seguridad.</p>
      </div>
    </div>

    <div className="card">
      <h3>Arreglos de Caracteres y Cadenas C</h3>
      <p>
        Los punteros a caracteres son utilizados frecuentemente para manipular cadenas de estilo C.
      </p>

      <div className="code-example">
        <pre>
          {`// Cadena de estilo C (termina con el carácter nulo '\0')
char mensaje[] = "Hola mundo";  // Equivalente a {'H','o','l','a',' ','m','u','n','d','o','\0'}

// Puntero a la cadena
char* pMensaje = mensaje;

// Recorrer con puntero
while (*pMensaje != '\0') {
    cout << *pMensaje;
    pMensaje++;
}
// Imprime: Hola mundo

// Uso más común: punteros a cadenas constantes
const char* texto = "Texto inmutable";  // Cadena literal en memoria de solo lectura
// texto[0] = 'X';  // ¡ERROR! No se puede modificar`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Comparación con Java</h3>
      <div className="comparacion">
        <div className="java">
          <h4>Java:</h4>
          <pre>
            {`// Java no expone directamente la relación entre arreglos y punteros
String[] nombres = {"Ana", "Pedro", "Luis"};

// No puedes convertir el arreglo en puntero
// Tienes que usar índices para acceder a elementos
for (int i = 0; i < nombres.length; i++) {
    System.out.println(nombres[i]);
}

// O usar for-each (similar al for de rango en C++)
for (String nombre : nombres) {
    System.out.println(nombre);
}

// Las cadenas son objetos inmutables
String mensaje = "Hola";
// No hay equivalente a char* en Java`}
          </pre>
        </div>
        <div className="cpp">
          <h4>C++:</h4>
          <pre>
            {`// C++ permite tratar arreglos como punteros
std::string nombres[] = {"Ana", "Pedro", "Luis"};

// Convertir implícitamente a puntero
std::string* p = nombres;

// Acceso mediante índices o aritmética de punteros
for (int i = 0; i < 3; i++) {
    std::cout << *(p + i) << std::endl;
}

// O usar for de rango (C++11 o superior)
for (const auto& nombre : nombres) {
    std::cout << nombre << std::endl;
}

// Manipulación de cadenas estilo C
char mensaje[] = "Hola";
mensaje[0] = 'M';  // Ahora es "Mola"`}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

export default PunterosArreglos; 