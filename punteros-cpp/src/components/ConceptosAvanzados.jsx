import React from 'react';

const ConceptosAvanzados = () => (
  <div className="seccion">
    <h2>Conceptos Avanzados de Punteros</h2>

    <div className="card">
      <h3>Punteros a Punteros</h3>
      <p>
        Un puntero puede almacenar la dirección de otro puntero, creando múltiples niveles
        de indirección.
      </p>

      <div className="code-example">
        <pre>
          {`int valor = 42;
int* pValor = &valor;      // Puntero a un entero
int** ppValor = &pValor;   // Puntero a un puntero a un entero

// Accediendo a través de múltiples niveles
cout << valor << endl;     // 42 - acceso directo
cout << *pValor << endl;   // 42 - un nivel de indirección
cout << **ppValor << endl; // 42 - dos niveles de indirección

// Modificando a través de puntero a puntero
**ppValor = 100;
cout << valor << endl;     // 100 - el valor original cambió

// Uso común: pasar punteros por referencia
void cambiarPuntero(int** pp, int* nuevoP) {
    *pp = nuevoP;  // Modifica a dónde apunta el puntero original
}

int otroValor = 99;
int* pOtro = &otroValor;
cambiarPuntero(&pValor, pOtro);  // pValor ahora apunta a otroValor
cout << *pValor << endl;        // 99`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Punteros Inteligentes Personalizados</h3>
      <p>
        Además de los punteros inteligentes estándar, puedes crear tus propios 
        punteros inteligentes con semántica personalizada usando el patrón RAII 
        (Resource Acquisition Is Initialization).
      </p>

      <div className="code-example">
        <pre>
          {`template <typename T>
class PunteroInteligente {
private:
    T* ptr;

public:
    // Constructor
    explicit PunteroInteligente(T* p = nullptr) : ptr(p) {}

    // Destructor - libera automáticamente el recurso
    ~PunteroInteligente() {
        delete ptr;
    }

    // Operador de desreferencia
    T& operator*() const { return *ptr; }

    // Operador de acceso a miembro
    T* operator->() const { return ptr; }

    // Prevenir copias (semántica única)
    PunteroInteligente(const PunteroInteligente&) = delete;
    PunteroInteligente& operator=(const PunteroInteligente&) = delete;

    // Permitir movimiento (C++11)
    PunteroInteligente(PunteroInteligente&& other) noexcept : ptr(other.ptr) {
        other.ptr = nullptr;
    }
    
    PunteroInteligente& operator=(PunteroInteligente&& other) noexcept {
        if (this != &other) {
            delete ptr;
            ptr = other.ptr;
            other.ptr = nullptr;
        }
        return *this;
    }
};

// Uso
void ejemplo() {
    PunteroInteligente<int> p(new int(42));
    cout << *p << endl;  // 42
    
    // La memoria se libera automáticamente al salir del ámbito
}`}
        </pre>
      </div>
    </div>

    <div className="card">
      <h3>Punteros a Miembros</h3>
      <p>
        C++ permite punteros a miembros de clases, que son diferentes de los punteros normales
        y tienen una sintaxis especial.
      </p>

      <div className="code-example">
        <pre>
          {`class Persona {
public:
    std::string nombre;
    int edad;
    
    void saludar() {
        cout << "Hola, soy " << nombre << endl;
    }
};

// Punteros a miembros de datos
std::string Persona::*pNombre = &Persona::nombre;  // Puntero al miembro nombre
int Persona::*pEdad = &Persona::edad;             // Puntero al miembro edad

// Puntero a función miembro
void (Persona::*pSaludar)() = &Persona::saludar;

// Uso
Persona persona{"Ana", 25};
Persona* pPersona = new Persona{"Carlos", 30};

// Acceso con punteros a miembros
cout << persona.*pNombre << endl;     // Ana
cout << pPersona->*pEdad << endl;     // 30

// Llamada a través de puntero a función miembro
(persona.*pSaludar)();                // Hola, soy Ana
(pPersona->*pSaludar)();              // Hola, soy Carlos

delete pPersona;`}
        </pre>
      </div>

      <div className="nota">
        <p><strong>Nota:</strong> Los punteros a miembros son útiles para implementar 
        mecanismos genéricos como serialización, reflexión, y bindings.</p>
      </div>
    </div>

    <div className="card">
      <h3>Placement new</h3>
      <p>
        "Placement new" es una variante del operador new que permite construir objetos
        en memoria ya asignada, dando control total sobre la ubicación de los objetos.
      </p>

      <div className="code-example">
        <pre>
          {`#include <new>  // Necesario para placement new

// Allocar memoria sin construir objetos
void* memoria = malloc(sizeof(int) * 10);

// Construir objetos en posiciones específicas
int* p1 = new(memoria) int(42);                        // Primer int en la memoria
int* p2 = new(static_cast<char*>(memoria) + sizeof(int)) int(73);  // Segundo int

// Para destruir sin liberar la memoria, llamar al destructor explícitamente
p1->~int();
p2->~int();

// Liberar la memoria original
free(memoria);

// Uso común: pools de memoria, arenas de asignación
char buffer[1024];  // Buffer estático grande
Persona* p = new(buffer) Persona{"Juan", 28};  // Construye objeto en el buffer

// No hacer delete p; - solo llamar al destructor
p->~Persona();`}
        </pre>
      </div>

      <div className="advertencia">
        <p><strong>¡Advertencia!</strong> Placement new requiere gestión manual cuidadosa.
        Debes llamar explícitamente a los destructores y asegurarte de que la memoria está
        alineada correctamente para el tipo que estás construyendo.</p>
      </div>
    </div>

    <div className="card">
      <h3>Punteros Offset y Técnicas de Introspección</h3>
      <p>
        Estas técnicas avanzadas permiten determinar la posición relativa de miembros dentro de una estructura.
      </p>

      <div className="code-example">
        <pre>
          {`#include <cstddef>  // Para offsetof

struct Empleado {
    int id;
    std::string nombre;
    double salario;
};

// Obtener el offset de un miembro
size_t idOffset = offsetof(Empleado, id);          // Típicamente 0
size_t salarioOffset = offsetof(Empleado, salario);  // Depende del compilador y alineación

cout << "El miembro id está a " << idOffset << " bytes del inicio" << endl;
cout << "El miembro salario está a " << salarioOffset << " bytes del inicio" << endl;

// Uso avanzado: acceder a miembros conociendo solo su offset
Empleado emp = {1001, "Maria", 50000.0};
char* basePtr = reinterpret_cast<char*>(&emp);

int* pId = reinterpret_cast<int*>(basePtr + idOffset);
double* pSalario = reinterpret_cast<double*>(basePtr + salarioOffset);

cout << *pId << endl;       // 1001
cout << *pSalario << endl;  // 50000.0

// Modificar a través del puntero calculado
*pSalario = 55000.0;
cout << emp.salario << endl;  // 55000.0`}
        </pre>
      </div>

      <div className="aviso">
        <p><strong>Nota:</strong> Estas técnicas son de muy bajo nivel y generalmente solo se usan
        en bibliotecas de serialización, frameworks de reflexión, o manipulación binaria directa.</p>
      </div>
    </div>

    <div className="card">
      <h3>Comparación con Java</h3>
      <div className="comparacion">
        <div className="java">
          <h4>Java:</h4>
          <pre>
            {`// Java no tiene punteros explícitos, muchos conceptos avanzados
// de punteros no tienen equivalente directo

// Para reflection y acceso a miembros:
import java.lang.reflect.*;

class MiClase {
    private int valor;
    public String nombre;
}

// Acceso mediante reflection
Field campo = MiClase.class.getDeclaredField("valor");
campo.setAccessible(true);  // Permite acceder a campos privados
MiClase obj = new MiClase();
campo.set(obj, 42);

// Memoria directa (NIO)
import java.nio.*;
ByteBuffer buffer = ByteBuffer.allocateDirect(1024);
buffer.putInt(0, 42);
int valor = buffer.getInt(0);`}
          </pre>
        </div>
        <div className="cpp">
          <h4>C++:</h4>
          <pre>
            {`// C++ ofrece control directo a través de punteros

// Punteros a punteros para indirección múltiple
int valor = 42;
int* p = &valor;
int** pp = &p;

// Gestión de memoria personalizada
void* memoria = operator new(1024);  // Asigna bloque sin construir
operator delete(memoria);            // Libera el bloque

// Punteros a miembros para mecanismos tipo reflection
struct Clase {
    int valor;
    void metodo() {}
};

int Clase::*pMiembro = &Clase::valor;
void (Clase::*pMetodo)() = &Clase::metodo;

Clase obj;
obj.*pMiembro = 42;
(obj.*pMetodo)();`}
          </pre>
        </div>
      </div>

      <p className="conclusion">
        Estos conceptos avanzados de punteros demuestran el poder y la flexibilidad que C++ 
        ofrece para el control de memoria y la programación de bajo nivel, pero también 
        requieren gran responsabilidad y comprensión para evitar errores.
      </p>
    </div>
  </div>
);

export default ConceptosAvanzados; 