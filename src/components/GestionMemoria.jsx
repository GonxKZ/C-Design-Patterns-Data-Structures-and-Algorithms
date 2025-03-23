import React from 'react';

const GestionMemoria = () => (
  <div className="seccion">
    <h2>Gestión de Memoria</h2>

    <div className="card">
      <h3>El Stack y el Heap</h3>
      <p>
        En C++, la memoria se divide principalmente en dos áreas:
      </p>
      <ul>
        <li><strong>Stack (Pila):</strong> Memoria de asignación automática y gestión automática. 
        Variables locales, parámetros de función, etc.</li>
        <li><strong>Heap (Montículo):</strong> Memoria de asignación dinámica que debe ser gestionada manualmente
        por el programador.</li>
      </ul>

      <div className="code-example">
        <pre>
          {`// Variables en el stack (se liberan automáticamente)
void funcion() {
    int x = 10;           // Asignado en el stack
    double y = 3.14;      // Asignado en el stack
}  // x e y se liberan automáticamente al salir del ámbito

// Variables en el heap (deben liberarse manualmente)
void otraFuncion() {
    int* p = new int;     // Asigna memoria en el heap
    *p = 42;              // Escribe en la memoria dinámica
    
    // Usar la memoria...
    
    delete p;             // IMPORTANTE: Liberar memoria cuando ya no se necesita
    p = nullptr;          // Buena práctica: Asignar nullptr después de delete
}`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Operadores new y delete</h3>
      <p>
        C++ utiliza los operadores <code>new</code> y <code>delete</code> para gestionar
        la memoria dinámica (en el heap).
      </p>

      <div className="code-example">
        <pre>
          {`// Asignación de un solo objeto
int* pEntero = new int;       // Reserva memoria para un entero
*pEntero = 100;               // Asigna un valor
delete pEntero;               // Libera la memoria

// Asignación con inicialización
double* pDecimal = new double(3.14159);  // Reserva e inicializa
delete pDecimal;              // Libera la memoria

// Asignación de arreglos
int* numeros = new int[10];   // Reserva un array de 10 enteros
numeros[0] = 1;               // Acceso como array normal
delete[] numeros;             // ¡IMPORTANTE! Usar delete[] para arrays`}
        </pre>
      </div>

      <div className="advertencia">
        <p><strong>¡Advertencia!</strong> Cada <code>new</code> debe tener su correspondiente <code>delete</code>.
        Usar <code>delete[]</code> para lo asignado con <code>new[]</code>. No usar <code>delete</code> para
        memoria no asignada con <code>new</code>.</p>
      </div>
    </div>

    <div className="card">
      <h3>Problemas comunes de memoria</h3>
      <div className="problemas">
        <div className="problema">
          <h4>1. Memory Leak (Fuga de Memoria)</h4>
          <pre>
            {`void funcionConFuga() {
    int* p = new int(42);
    // No hay delete, la memoria queda inaccesible cuando p sale de ámbito
    // pero sigue ocupada -> memory leak
}`}
          </pre>
        </div>

        <div className="problema">
          <h4>2. Dangling Pointer (Puntero Colgante)</h4>
          <pre>
            {`int* funcionPeligrosa() {
    int local = 10;
    return &local;  // ¡ERROR! Devuelve dirección de variable local
                   // que dejará de existir al salir de la función
}

// Otro caso común
int* p = new int(42);
delete p;           // Memoria liberada
// p ahora es un dangling pointer (apunta a memoria liberada)
*p = 100;           // ¡PELIGRO! Comportamiento indefinido`}
          </pre>
        </div>

        <div className="problema">
          <h4>3. Double Free (Doble Liberación)</h4>
          <pre>
            {`int* p = new int(42);
delete p;    // Correcto: primera liberación
delete p;    // ¡ERROR! Segunda liberación de la misma memoria
             // Comportamiento indefinido`}
          </pre>
        </div>
      </div>
    </div>

    <div className="card">
      <h3>Smart Pointers (Punteros Inteligentes)</h3>
      <p>
        C++ moderno ofrece punteros inteligentes que automatizan la gestión de memoria,
        evitando muchos de los problemas anteriores.
      </p>

      <div className="code-example">
        <pre>
          {`#include <memory>  // Necesario para smart pointers

// std::unique_ptr - Propiedad exclusiva (no se puede copiar)
std::unique_ptr<int> u1 = std::make_unique<int>(42);
// No necesitas delete, la memoria se libera automáticamente
// cuando u1 sale de ámbito

// std::shared_ptr - Propiedad compartida (con conteo de referencias)
std::shared_ptr<int> s1 = std::make_shared<int>(10);
std::shared_ptr<int> s2 = s1;  // Ambos apuntan al mismo recurso
// La memoria se libera cuando el último shared_ptr sale de ámbito

// std::weak_ptr - Observador débil de un shared_ptr
std::weak_ptr<int> w1 = s1;
// No incrementa el conteo de referencias
// Útil para romper referencias circulares`}
        </pre>
      </div>

      <div className="consejo">
        <p><strong>Consejo:</strong> En C++ moderno, prefiere siempre usar smart pointers 
        en lugar de gestionar la memoria manualmente. Usa <code>unique_ptr</code> por defecto,
        y <code>shared_ptr</code> solo cuando realmente necesites propiedad compartida.</p>
      </div>
    </div>

    <div className="card">
      <h3>Comparación con Java</h3>
      <div className="comparacion">
        <div className="java">
          <h4>Java:</h4>
          <pre>
            {`// En Java, la gestión de memoria es automática
void metodo() {
    String texto = new String("Hola");
    // No hay delete/free
}  // El recolector de basura se encargará de liberar la memoria

// No hay distinción explícita entre stack y heap
// para el programador
int x = 10;            // Primitivo podría estar en el stack
Integer y = new Integer(20);  // Objeto siempre en el heap

// No es posible el acceso directo a memoria liberada
// El garbage collector previene memory leaks y dangling pointers`}
          </pre>
        </div>
        <div className="cpp">
          <h4>C++:</h4>
          <pre>
            {`// En C++, la gestión de memoria puede ser manual
void funcion() {
    int x = 10;               // Automático en el stack
    int* pY = new int(20);    // Manual en el heap
    delete pY;                // Debes liberar manualmente
} 

// Enfoque moderno con RAII y smart pointers
void funcionModerna() {
    int x = 10;                           // Stack
    std::unique_ptr<int> pY = std::make_unique<int>(20);  // Heap
    // No necesitas delete, se libera automáticamente
}

// Objetos grandes normalmente en el heap
// Primitivos y objetos pequeños normalmente en el stack`}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

export default GestionMemoria; 