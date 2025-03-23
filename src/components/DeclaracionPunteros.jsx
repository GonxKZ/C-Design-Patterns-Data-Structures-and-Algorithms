import React from 'react';

const DeclaracionPunteros = () => (
  <div className="seccion">
    <h2>Declaración y Uso Básico de Punteros</h2>

    <div className="card">
      <h3>Declaración de Punteros</h3>
      <p>
        En C++, los punteros se declaran usando un asterisco (*) después del tipo de dato.
        El puntero almacenará direcciones de memoria que apuntan a valores de ese tipo.
      </p>

      <div className="code-example">
        <pre>
          {`// Declaración de punteros
int* pEntero;      // Puntero a entero
double* pDecimal;  // Puntero a double
char* pCaracter;   // Puntero a caracteres (C-string)

// Estilos alternativos (funcionalmente equivalentes)
int *pEntero2;     // El asterisco puede ir junto al tipo o variable
int * pEntero3;    // Con espacios a ambos lados`}
        </pre>
      </div>

      <div className="nota">
        <p><strong>Nota:</strong> Un puntero recién declarado no apunta a ninguna ubicación válida.
        Siempre inicializa tus punteros antes de usarlos.</p>
      </div>
    </div>

    <div className="card">
      <h3>Operador de dirección (&)</h3>
      <p>
        El operador <code>&</code> devuelve la dirección de memoria de una variable.
        Se usa para asignar la dirección de una variable a un puntero.
      </p>

      <div className="code-example">
        <pre>
          {`int numero = 42;
int* pNumero = &numero;  // pNumero ahora contiene la dirección de memoria de 'numero'

// Visualización (no es código real)
// numero:  [42]           ubicado en dirección 0x1000
// pNumero: [0x1000]       contiene la dirección de 'numero'`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Operador de desreferencia (*)</h3>
      <p>
        El operador <code>*</code> cuando se aplica a un puntero, se llama operador de 
        desreferencia y permite acceder al valor almacenado en la dirección apuntada.
      </p>

      <div className="code-example">
        <pre>
          {`int numero = 42;
int* pNumero = &numero;

// Accediendo al valor usando el puntero
cout << *pNumero << endl;  // Imprime: 42

// Modificando el valor a través del puntero
*pNumero = 100;
cout << numero << endl;    // Imprime: 100 (¡la variable original cambió!)

// Visualmente:
// numero:  [100]          ubicado en dirección 0x1000
// pNumero: [0x1000]       contiene la dirección de 'numero'
// *pNumero accede a [100] siguiendo la dirección`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Puntero nulo (nullptr)</h3>
      <p>
        Un puntero nulo es un puntero que no apunta a ninguna ubicación de memoria válida.
        En C++ moderno se usa <code>nullptr</code> para representar un puntero nulo.
      </p>

      <div className="code-example">
        <pre>
          {`// C++ moderno (preferido)
int* p1 = nullptr;

// Estilos antiguos (evitar en código nuevo)
int* p2 = NULL;     // C-style, definido como 0 o (void*)0
int* p3 = 0;        // Funciona, pero menos explícito

// Siempre verifica si un puntero es nulo antes de desreferenciarlo
if (p1 != nullptr) {
    cout << *p1 << endl;  // Seguro: solo desreferencia si no es nullptr
} else {
    cout << "Puntero nulo, no se puede desreferenciar" << endl;
}`}
        </pre>
      </div>

      <div className="aviso">
        <p><strong>¡Aviso!</strong> Desreferenciar un puntero nulo causa un comportamiento indefinido 
        (generalmente un crash del programa con "Segmentation Fault" o "Access Violation").</p>
      </div>
    </div>

    <div className="card">
      <h3>Comparación con Java</h3>
      <div className="comparacion">
        <div className="java">
          <h4>Java:</h4>
          <pre>
            {`// Java usa referencias implícitas
String texto = "Hola";
String otraRef = texto;  // referencia al mismo objeto

// Verificación de nulo
if (texto != null) {
    System.out.println(texto.length());
}

// Asignación nula
texto = null;`}
          </pre>
        </div>
        <div className="cpp">
          <h4>C++:</h4>
          <pre>
            {`// C++ usa punteros explícitos
std::string texto = "Hola";
std::string* pTexto = &texto;  // puntero a texto

// Verificación de nulo
if (pTexto != nullptr) {
    std::cout << (*pTexto).length() << std::endl;
    // O usando el operador flecha
    std::cout << pTexto->length() << std::endl;
}

// Asignación nula
pTexto = nullptr;`}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

export default DeclaracionPunteros; 