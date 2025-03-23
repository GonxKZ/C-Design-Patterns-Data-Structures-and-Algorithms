import React from 'react';

const OperacionesPunteros = () => (
  <div className="seccion">
    <h2>Operaciones con Punteros</h2>

    <div className="card">
      <h3>Aritmética de Punteros</h3>
      <p>
        Una de las características más potentes de los punteros en C++ es la capacidad de
        realizar operaciones aritméticas con ellos. Esto permite recorrer memoria de forma eficiente.
      </p>
      
      <div className="code-example">
        <pre>
          {`int numeros[5] = {10, 20, 30, 40, 50};
int* p = numeros;  // p apunta al primer elemento del array

// Avanzar el puntero (p + 1 apunta al siguiente elemento)
cout << *p << endl;       // Imprime: 10
cout << *(p + 1) << endl; // Imprime: 20
cout << *(p + 2) << endl; // Imprime: 30

// Avance con incremento
p++;                      // p ahora apunta al segundo elemento
cout << *p << endl;       // Imprime: 20

// Retroceder el puntero
p--;                      // p vuelve a apuntar al primer elemento
cout << *p << endl;       // Imprime: 10`}
        </pre>
      </div>

      <div className="importante">
        <p><strong>Importante:</strong> La aritmética de punteros tiene en cuenta el tamaño del tipo.
        Si <code>p</code> es un puntero a <code>int</code> y cada <code>int</code> ocupa 4 bytes, 
        entonces <code>p + 1</code> avanza 4 bytes en memoria, no solo 1 byte.</p>
      </div>
    </div>

    <div className="card">
      <h3>Operaciones de Comparación</h3>
      <p>
        Los punteros pueden compararse entre sí para determinar sus posiciones relativas en memoria.
      </p>

      <div className="code-example">
        <pre>
          {`int arr[5] = {1, 2, 3, 4, 5};
int* p1 = &arr[0];
int* p2 = &arr[3];

// Comparaciones
if (p1 < p2) {
    cout << "p1 está antes que p2 en memoria" << endl;
}

// Calcular distancia entre punteros
ptrdiff_t distancia = p2 - p1;
cout << "Hay " << distancia << " elementos entre p1 y p2" << endl;
// Imprime: Hay 3 elementos entre p1 y p2`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Operador Flecha ({'->'}) </h3>
      <p>
        El operador flecha es un acceso directo para desreferenciar un puntero y acceder a un miembro
        de la estructura o clase a la que apunta.
      </p>

      <div className="code-example">
        <pre>
          {`struct Persona {
    string nombre;
    int edad;
};

Persona ana = {"Ana", 25};
Persona* pAna = &ana;

// Acceder a los miembros con desreferencia (forma larga)
cout << (*pAna).nombre << endl; // Imprime: Ana
cout << (*pAna).edad << endl;   // Imprime: 25

// Acceder con operador flecha (forma corta - recomendada)
cout << pAna->nombre << endl;   // Imprime: Ana
cout << pAna->edad << endl;     // Imprime: 25

// Modificar usando el operador flecha
pAna->edad = 26;
cout << ana.edad << endl;       // Imprime: 26`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Punteros void</h3>
      <p>
        Un puntero <code>void*</code> es un puntero genérico que puede almacenar la dirección de cualquier tipo,
        pero no permite desreferenciar directamente.
      </p>

      <div className="code-example">
        <pre>
          {`int entero = 42;
double decimal = 3.14;
char caracter = 'A';

// Puntero void puede apuntar a cualquier tipo
void* punteroGenerico;

punteroGenerico = &entero;    // Apunta a un entero
punteroGenerico = &decimal;   // Ahora apunta a un double
punteroGenerico = &caracter;  // Ahora apunta a un char

// Para usar el valor, hay que convertir el puntero void al tipo adecuado
punteroGenerico = &entero;
int* pInt = static_cast<int*>(punteroGenerico);
cout << *pInt << endl;        // Imprime: 42`}
        </pre>
      </div>

      <div className="nota">
        <p><strong>Nota:</strong> Los punteros <code>void*</code> son útiles para APIs genéricas, 
        pero reducen la seguridad de tipos. Usa con precaución.</p>
      </div>
    </div>

    <div className="card">
      <h3>Diferencias con Java</h3>
      <div className="comparacion">
        <div className="java">
          <h4>Java:</h4>
          <pre>
            {`// Java no permite operaciones aritméticas con referencias
String[] palabras = {"Hola", "Mundo"};
String primeraPalabra = palabras[0];
String segundaPalabra = palabras[1];

// No hay equivalente a p++ o p + 1

// El operador punto se usa tanto para objetos como para referencias
Persona persona = new Persona("Juan", 30);
System.out.println(persona.nombre);  // Siempre usa punto`}
          </pre>
        </div>
        <div className="cpp">
          <h4>C++:</h4>
          <pre>
            {`// C++ permite aritmética de punteros
std::string palabras[] = {"Hola", "Mundo"};
std::string* p = palabras;

std::cout << *p << std::endl;      // Imprime: Hola
std::cout << *(p+1) << std::endl;  // Imprime: Mundo
p++;                            // p ahora apunta a "Mundo"

// Operador flecha para punteros, punto para objetos directos
Persona persona = {"Juan", 30};
Persona* ptr = &persona;

std::cout << persona.nombre << std::endl;  // Usando punto
std::cout << ptr->nombre << std::endl;     // Usando flecha`}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

export default OperacionesPunteros; 