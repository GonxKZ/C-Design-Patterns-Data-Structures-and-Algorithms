import React from 'react';

const PunterosFunciones = () => (
  <div className="seccion">
    <h2>Punteros a Funciones</h2>

    <div className="card">
      <h3>¿Qué son los punteros a funciones?</h3>
      <p>
        Un puntero a función es un tipo de puntero que almacena la dirección de una función,
        permitiendo llamar a la función indirectamente a través del puntero. Esto permite:
      </p>
      <ul>
        <li>Pasar funciones como argumentos a otras funciones</li>
        <li>Devolver funciones como valores de retorno</li>
        <li>Almacenar funciones en estructuras de datos</li>
        <li>Implementar callbacks y patrones de diseño avanzados</li>
      </ul>
    </div>

    <div className="card">
      <h3>Declaración de Punteros a Funciones</h3>
      <p>
        La sintaxis para declarar punteros a funciones puede resultar compleja, ya que debe
        especificar el tipo de retorno y los parámetros de la función.
      </p>

      <div className="code-example">
        <pre>
          {`// Primero, definamos algunas funciones
int suma(int a, int b) {
    return a + b;
}

int resta(int a, int b) {
    return a - b;
}

// Declaración de un puntero a función que toma dos enteros y devuelve un entero
int (*pOperacion)(int, int);

// Asignación de funciones al puntero
pOperacion = suma;    // pOperacion ahora apunta a la función suma
cout << pOperacion(5, 3) << endl;  // Imprime: 8

pOperacion = resta;   // pOperacion ahora apunta a la función resta
cout << pOperacion(5, 3) << endl;  // Imprime: 2`}
        </pre>
      </div>

      <div className="nota">
        <p><strong>Nota:</strong> Los paréntesis alrededor de <code>*pOperacion</code> son 
        necesarios debido a la precedencia de operadores. Sin ellos, sería una declaración 
        de una función que devuelve un puntero a <code>int</code>.</p>
      </div>
    </div>

    <div className="card">
      <h3>Typedef y using para Simplificar</h3>
      <p>
        Para hacer más legible el código, podemos usar <code>typedef</code> o <code>using</code> 
        para crear alias de tipos de punteros a funciones.
      </p>

      <div className="code-example">
        <pre>
          {`// Con typedef (estilo tradicional)
typedef int (*OperacionBinaria)(int, int);

// Con using (estilo moderno, C++11 y posteriores)
using OperacionMatematica = int (*)(int, int);

// Ahora es más fácil declarar punteros a funciones
OperacionBinaria op1 = suma;
OperacionMatematica op2 = resta;

cout << op1(10, 5) << endl;  // Imprime: 15
cout << op2(10, 5) << endl;  // Imprime: 5`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Punteros a Funciones como Parámetros</h3>
      <p>
        Una aplicación común de los punteros a funciones es pasarlos como argumentos a otras funciones,
        permitiendo comportamientos personalizables.
      </p>

      <div className="code-example">
        <pre>
          {`// Función que recibe un puntero a función como parámetro
void procesarArray(int arr[], int tamano, int (*operacion)(int)) {
    for (int i = 0; i < tamano; i++) {
        arr[i] = operacion(arr[i]);
    }
}

// Funciones que podemos pasar como argumentos
int duplicar(int x) {
    return x * 2;
}

int cuadrado(int x) {
    return x * x;
}

// Uso
int valores[] = {1, 2, 3, 4, 5};

procesarArray(valores, 5, duplicar);
// valores ahora es {2, 4, 6, 8, 10}

procesarArray(valores, 5, cuadrado);
// valores ahora es {4, 16, 36, 64, 100}`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Arreglos de Punteros a Funciones</h3>
      <p>
        Los punteros a funciones pueden organizarse en arreglos, lo que permite elegir funciones
        dinámicamente basándose en un índice o una condición.
      </p>

      <div className="code-example">
        <pre>
          {`// Definir funciones con una firma compatible
double suma(double a, double b) { return a + b; }
double resta(double a, double b) { return a - b; }
double multiplicacion(double a, double b) { return a * b; }
double division(double a, double b) { return a / b; }

// Crear un arreglo de punteros a funciones
double (*operaciones[4])(double, double) = {suma, resta, multiplicacion, division};

// Uso con índice
int opcion = 2;  // Selecciona multiplicación
cout << operaciones[opcion](10.0, 5.0) << endl;  // Imprime: 50

// Uso en un bucle
double a = 10.0, b = 5.0;
for (int i = 0; i < 4; i++) {
    cout << "Operación " << i << ": " << operaciones[i](a, b) << endl;
}
// Imprime los resultados de todas las operaciones`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>C++ Moderno: Lambdas y std::function</h3>
      <p>
        En C++ moderno, se suele usar <code>std::function</code> y expresiones lambda para 
        reemplazar los punteros a funciones tradicionales, ofreciendo más flexibilidad.
      </p>

      <div className="code-example">
        <pre>
          {`#include <functional>
#include <iostream>
#include <vector>

// Usando std::function en lugar de punteros a funciones
void procesarDatos(const std::vector<int>& datos, 
                   std::function<int(int)> transformador) {
    for (int valor : datos) {
        std::cout << transformador(valor) << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::vector<int> numeros = {1, 2, 3, 4, 5};
    
    // Uso con función regular
    procesarDatos(numeros, duplicar);
    
    // Uso con expresión lambda
    procesarDatos(numeros, [](int x) { return x * x; });
    
    // Lambda con estado capturado
    int factor = 3;
    procesarDatos(numeros, [factor](int x) { return x * factor; });
    
    return 0;
}`}
        </pre>
      </div>

      <div className="ventajas">
        <p><strong>Ventajas de std::function sobre punteros a funciones:</strong></p>
        <ul>
          <li>Puede almacenar cualquier tipo llamable (funciones, lambdas, functores)</li>
          <li>Soporta lambdas con estado (que capturan variables)</li>
          <li>Sintaxis más clara y consistente</li>
          <li>Mejor integración con el resto de la biblioteca estándar</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <h3>Comparación con Java</h3>
      <div className="comparacion">
        <div className="java">
          <h4>Java:</h4>
          <pre>
            {`// Java no tiene punteros a funciones, pero tiene interfaces funcionales
// y expresiones lambda desde Java 8

// Interfaz funcional (similar a un tipo de puntero a función)
interface Operacion {
    int aplicar(int a, int b);
}

// Uso con clase anónima (antes de Java 8)
Operacion suma = new Operacion() {
    @Override
    public int aplicar(int a, int b) {
        return a + b;
    }
};

// Uso con lambdas (Java 8+)
Operacion resta = (a, b) -> a - b;

// Método que recibe una función como parámetro
void calcular(int x, int y, Operacion op) {
    System.out.println(op.aplicar(x, y));
}

// Usar método de referencia
import java.util.function.*;
Function<Integer, Integer> duplicador = x -> x * 2;
// O con referencia a método
UnaryOperator<Integer> duplicadorRef = MiClase::duplicar;`}
          </pre>
        </div>
        <div className="cpp">
          <h4>C++:</h4>
          <pre>
            {`// C++ ofrece punteros a funciones y std::function

// Puntero a función (sintaxis tradicional)
int (*pOperacion)(int, int) = suma;

// Con std::function (C++11 y posterior)
#include <functional>
std::function<int(int, int)> operacion = suma;

// Con lambdas (C++11 y posterior)
auto operacion = [](int a, int b) { return a + b; };

// Método que recibe una función
void calcular(int x, int y, std::function<int(int,int)> op) {
    std::cout << op(x, y) << std::endl;
}

// Almacenar en contenedores
std::vector<std::function<void()>> acciones;
acciones.push_back([]() { std::cout << "Acción 1" << std::endl; });
acciones.push_back([]() { std::cout << "Acción 2" << std::endl; });

// Ejecutar todas las acciones
for (const auto& accion : acciones) {
    accion();
}`}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

export default PunterosFunciones; 