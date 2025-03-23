const monadPattern = {
  id: 'monad',
  name: 'Mónada (Monad)',
  category: 'functional',
  description: 'Un patrón que encapsula computaciones y sus potenciales efectos secundarios, permitiendo componer operaciones de manera segura y predecible, manteniendo el contexto durante la ejecución.',
  
  theory: {
    background: 'Las mónadas tienen su origen en la teoría de categorías en matemáticas y fueron adaptadas a la programación funcional inicialmente en lenguajes como Haskell. Se han convertido en una abstracción fundamental en la programación funcional para manejar efectos secundarios de forma controlada.',
    problem: 'En programación funcional, los efectos secundarios (como operaciones de E/S, operaciones que pueden fallar, o estado mutable) rompen la pureza y composición de funciones, dificultando el razonamiento sobre el programa y su testabilidad.',
    solution: 'Encapsular los valores y sus potenciales efectos en una estructura (la mónada) que define cómo se propagan estos efectos a través de una serie de operaciones encadenadas, manteniendo la composición y el razonamiento equacional.',
    applicability: [
      "Manejo de operaciones que pueden fallar (Maybe/Option, Either/Result)",
      "Procesamiento de colecciones (List monad)",
      "Operaciones asíncronas y programación reactiva (Promise/Future)",
      "Gestión de estado inmutable (State monad)",
      "Operaciones de E/S (IO monad)",
      "Parsers y procesamiento de lenguajes"
    ],
    consequences: [
      "Separación clara entre lógica pura y efectos secundarios",
      "Código más composable y reutilizable",
      "Mayor facilidad para razonar sobre el flujo del programa",
      "Manejo uniforme de distintos tipos de efectos",
      "Posible complejidad adicional y curva de aprendizaje",
      "Posible impacto en el rendimiento debido a las abstracciones"
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <functional>
#include <optional>
#include <string>
#include <vector>

// Implementación de Maybe monad (también conocida como Option monad)
template<typename T>
class Maybe {
private:
    std::optional<T> value;
    
public:
    // Constructor para valor presente
    explicit Maybe(const T& v) : value(v) {}
    
    // Constructor para valor ausente (Nothing)
    Maybe() : value(std::nullopt) {}
    
    // Constructor de copia
    Maybe(const Maybe& other) = default;
    
    // Función bind (>>=) - el método central de una mónada
    template<typename Func>
    auto bind(Func f) const -> decltype(f(value.value())) {
        if (value.has_value()) {
            return f(value.value());
        } else {
            // Si no hay valor, devuelve una Maybe vacía del tipo de retorno de f
            using ReturnType = decltype(f(value.value()));
            return ReturnType();
        }
    }
    
    // Función map para transformar el valor si existe
    template<typename Func>
    auto map(Func f) const -> Maybe<decltype(f(value.value()))> {
        if (value.has_value()) {
            return Maybe<decltype(f(value.value()))>(f(value.value()));
        } else {
            return Maybe<decltype(f(value.value()))>();
        }
    }
    
    // Función para obtener el valor o un valor por defecto
    T valueOr(const T& defaultValue) const {
        return value.value_or(defaultValue);
    }
    
    // Comprobar si hay un valor
    bool hasValue() const {
        return value.has_value();
    }
    
    // Operador para facilitar el uso con if
    explicit operator bool() const {
        return hasValue();
    }
    
    // Obtener el valor (cuidado, puede lanzar excepción si no hay valor)
    const T& getValue() const {
        return value.value();
    }
};

// Funciones de ayuda para Maybe
template<typename T>
Maybe<T> Just(const T& value) {
    return Maybe<T>(value);
}

template<typename T>
Maybe<T> Nothing() {
    return Maybe<T>();
}

// Ejemplo de uso
int main() {
    auto divide = [](int a, int b) -> Maybe<int> {
        if (b == 0) return Nothing<int>();
        return Just(a / b);
    };
    
    auto double_value = [](int x) -> Maybe<int> {
        return Just(x * 2);
    };
    
    auto toString = [](int x) -> std::string {
        return "Resultado: " + std::to_string(x);
    };
    
    // Composición de operaciones usando bind
    auto result1 = divide(10, 2)
                      .bind([&](int x) { return double_value(x); })
                      .map(toString);
                      
    auto result2 = divide(10, 0)
                      .bind([&](int x) { return double_value(x); })
                      .map(toString);
    
    if (result1) {
        std::cout << result1.getValue() << std::endl; // Muestra "Resultado: 10"
    }
    
    if (result2) {
        std::cout << result2.getValue() << std::endl; // No se ejecuta
    } else {
        std::cout << "La operación falló" << std::endl;
    }
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las cabeceras necesarias para nuestro ejemplo.' },
        { line: 6, text: 'Definimos la clase template Maybe que implementa una mónada para manejar valores opcionales.' },
        { line: 8, text: 'Internamente usamos std::optional para almacenar el valor que puede estar presente o ausente.' },
        { line: 12, text: 'Constructor que crea una mónada con un valor presente.' },
        { line: 15, text: 'Constructor que crea una mónada sin valor (Nothing).' },
        { line: 21, text: 'La función bind (>>=) es la operación fundamental de una mónada que permite encadenar operaciones.' },
        { line: 22, text: 'Si hay un valor presente, aplicamos la función f a ese valor.' },
        { line: 25, text: 'Si no hay valor, retornamos una mónada vacía del tipo apropiado.' },
        { line: 31, text: 'La función map transforma el valor dentro de la mónada si existe, sin alterar el contexto monádico.' },
        { line: 40, text: 'Método para obtener el valor o un valor por defecto si no hay valor.' },
        { line: 45, text: 'Método para comprobar si la mónada contiene un valor.' },
        { line: 50, text: 'Sobrecargamos el operador bool para facilitar el uso condicional.' },
        { line: 55, text: 'Método para obtener el valor. Puede lanzar una excepción si se llama cuando no hay valor.' },
        { line: 62, text: 'Función helper para crear una mónada con un valor (Just).' },
        { line: 67, text: 'Función helper para crear una mónada sin valor (Nothing).' },
        { line: 73, text: 'Creamos una función que puede fallar (división) y retorna una mónada.' },
        { line: 74, text: 'Si el divisor es cero, retornamos Nothing (mónada sin valor).' },
        { line: 78, text: 'Otra función que trabaja con mónadas, duplicando un valor.' },
        { line: 86, text: 'Componemos operaciones encadenando bind y map.' },
        { line: 87, text: 'bind toma una función que retorna una mónada, permitiendo encadenar operaciones monádicas.' },
        { line: 88, text: 'map transforma el valor dentro de la mónada si existe, manteniéndolo en el contexto monádico.' },
        { line: 94, text: 'Verificamos si hay un valor antes de acceder a él.' },
        { line: 99, text: 'Detectamos el caso de fallo (división por cero) y manejamos la situación adecuadamente.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <functional>
#include <optional>
#include <string>
#include <vector>
#include <type_traits>
#include <utility>

// Implementación moderna de Maybe monad usando SFINAE y perfect forwarding
template<typename T>
class Maybe {
private:
    std::optional<T> value;
    
public:
    // Constructor para valor presente con perfect forwarding
    template<typename U,
             typename = std::enable_if_t<std::is_convertible_v<U, T>>>
    explicit Maybe(U&& v) : value(std::forward<U>(v)) {}
    
    // Constructor para valor ausente (Nothing)
    Maybe() : value(std::nullopt) {}
    
    // Constructores de copia y movimiento generados automáticamente
    Maybe(const Maybe&) = default;
    Maybe(Maybe&&) = default;
    Maybe& operator=(const Maybe&) = default;
    Maybe& operator=(Maybe&&) = default;
    
    // Función bind (>>=) con SFINAE para soportar diferentes tipos de retorno
    template<typename Func,
             typename RetType = std::invoke_result_t<Func, T&>,
             typename = std::enable_if_t<std::is_same_v<RetType, Maybe<typename RetType::value_type>>>>
    auto bind(Func&& f) const -> RetType {
        if (value.has_value()) {
            return std::forward<Func>(f)(value.value());
        } else {
            return RetType();
        }
    }
    
    // Función map con perfect forwarding
    template<typename Func,
             typename RetType = std::invoke_result_t<Func, T&>>
    auto map(Func&& f) const -> Maybe<RetType> {
        if (value.has_value()) {
            return Maybe<RetType>(std::forward<Func>(f)(value.value()));
        } else {
            return Maybe<RetType>();
        }
    }
    
    // Operador >>= como alternativa a bind para sintaxis más expresiva
    template<typename Func>
    auto operator>>=(Func&& f) const -> decltype(this->bind(std::forward<Func>(f))) {
        return bind(std::forward<Func>(f));
    }
    
    // Operador | como alternativa a map para sintaxis más expresiva
    template<typename Func>
    auto operator|(Func&& f) const -> decltype(this->map(std::forward<Func>(f))) {
        return map(std::forward<Func>(f));
    }
    
    // Función para obtener el valor o un valor por defecto con perfect forwarding
    template<typename U>
    auto valueOr(U&& defaultValue) const -> T {
        return value.value_or(std::forward<U>(defaultValue));
    }
    
    // Funciones adicionales
    bool hasValue() const {
        return value.has_value();
    }
    
    explicit operator bool() const {
        return hasValue();
    }
    
    const T& getValue() const& {
        return value.value();
    }
    
    T&& getValue() && {
        return std::move(value).value();
    }
    
    // Visitar el valor (similar a std::visit para std::variant)
    template<typename FuncJust, typename FuncNothing>
    auto visit(FuncJust&& fJust, FuncNothing&& fNothing) const 
        -> std::invoke_result_t<FuncJust, const T&> {
        if (value.has_value()) {
            return std::forward<FuncJust>(fJust)(value.value());
        } else {
            return std::forward<FuncNothing>(fNothing)();
        }
    }
};

// Funciones de ayuda para crear instancias de Maybe
template<typename T>
auto Just(T&& value) -> Maybe<std::decay_t<T>> {
    return Maybe<std::decay_t<T>>(std::forward<T>(value));
}

template<typename T>
auto Nothing() -> Maybe<T> {
    return Maybe<T>();
}

// Ejemplo de uso
int main() {
    // Funciones que devuelven mónadas
    auto divide = [](int a, int b) -> Maybe<int> {
        if (b == 0) return Nothing<int>();
        return Just(a / b);
    };
    
    auto double_value = [](int x) -> Maybe<int> {
        return Just(x * 2);
    };
    
    auto toString = [](int x) -> std::string {
        return "Resultado: " + std::to_string(x);
    };
    
    // Uso con bind (>>=) explícito
    auto result1 = divide(10, 2).bind([&](int x) { 
        return double_value(x); 
    }).map(toString);
    
    // Uso con operadores >>= y | para una sintaxis más fluida
    auto result2 = divide(10, 0) >>= double_value | toString;
    
    // Uso de visit para manejar ambos casos sin comprobaciones explícitas
    result1.visit(
        [](const std::string& s) { std::cout << s << std::endl; },
        []() { std::cout << "La operación falló" << std::endl; }
    );
    
    result2.visit(
        [](const std::string& s) { std::cout << s << std::endl; },
        []() { std::cout << "La operación falló" << std::endl; }
    );
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos cabeceras adicionales para características de C++ moderno como SFINAE.' },
        { line: 10, text: 'Definimos la clase template Maybe con implementación moderna.' },
        { line: 15, text: 'Constructor con template y perfect forwarding para soportar referencias y movimiento.' },
        { line: 16, text: 'Usamos SFINAE (std::enable_if_t) para habilitar este constructor solo si U es convertible a T.' },
        { line: 22, text: 'Generamos automáticamente constructores de copia y movimiento.' },
        { line: 28, text: 'Implementación de bind con SFINAE para verificar que el tipo de retorno sea una mónada.' },
        { line: 29, text: 'Usamos std::invoke_result_t para determinar el tipo de retorno de la función f.' },
        { line: 30, text: 'Verificamos que el tipo de retorno sea una mónada usando std::is_same_v.' },
        { line: 40, text: 'Implementación de map que aplica una función y envuelve el resultado en una mónada.' },
        { line: 50, text: 'Sobrecargamos el operador >>= como sinónimo de bind para una sintaxis más expresiva.' },
        { line: 55, text: 'Sobrecargamos el operador | como sinónimo de map para una sintaxis más funcional.' },
        { line: 60, text: 'Método valueOr mejorado con perfect forwarding.' },
        { line: 71, text: 'Sobrecargamos getValue para soportar tanto referencias constantes como valores rvalue.' },
        { line: 75, text: 'Versión que maneja rvalues usando std::move para optimizar.' },
        { line: 79, text: 'Método visit que aplica una función diferente según si hay valor o no.' },
        { line: 80, text: 'Deducimos el tipo de retorno usando std::invoke_result_t.' },
        { line: 91, text: 'Función Just mejorada con perfect forwarding y std::decay_t para manejar referencias.' },
        { line: 96, text: 'Función Nothing modernizada con sintaxis de trailing return type.' },
        { line: 115, text: 'Ejemplo de uso con bind explícito.' },
        { line: 120, text: 'Ejemplo usando operadores sobrecargados para una sintaxis más funcional.' },
        { line: 123, text: 'Uso de visit para manejar los casos de éxito y fallo con lambdas específicas.' }
      ]
    },
    java: {
      code: `import java.util.function.Function;
import java.util.function.Supplier;
import java.util.Optional;

/**
 * Implementación de una mónada Maybe en Java
 */
public class Maybe<T> {
    private final T value;
    private final boolean hasValue;
    
    // Constructor privado, usar los métodos factory
    private Maybe(T value, boolean hasValue) {
        this.value = value;
        this.hasValue = hasValue;
    }
    
    // Método factory para crear una instancia con valor
    public static <T> Maybe<T> just(T value) {
        if (value == null) {
            throw new IllegalArgumentException("Valor no puede ser null, usar nothing() para representar ausencia de valor");
        }
        return new Maybe<>(value, true);
    }
    
    // Método factory para crear una instancia sin valor
    public static <T> Maybe<T> nothing() {
        return new Maybe<>(null, false);
    }
    
    // Método bind para componer operaciones monádicas
    public <R> Maybe<R> bind(Function<? super T, Maybe<R>> f) {
        if (hasValue) {
            return f.apply(value);
        } else {
            return nothing();
        }
    }
    
    // Método map para transformar el valor si existe
    public <R> Maybe<R> map(Function<? super T, ? extends R> f) {
        if (hasValue) {
            return just(f.apply(value));
        } else {
            return nothing();
        }
    }
    
    // Método para obtener el valor o un valor por defecto
    public T orElse(T defaultValue) {
        return hasValue ? value : defaultValue;
    }
    
    // Método para obtener el valor o lanzar una excepción
    public T orElseThrow(Supplier<? extends RuntimeException> exceptionSupplier) {
        if (hasValue) {
            return value;
        } else {
            throw exceptionSupplier.get();
        }
    }
    
    // Método para ejecutar un efecto solo si hay valor
    public Maybe<T> ifPresent(java.util.function.Consumer<? super T> consumer) {
        if (hasValue) {
            consumer.accept(value);
        }
        return this;
    }
    
    // Método para ejecutar un efecto solo si no hay valor
    public Maybe<T> ifNothing(Runnable action) {
        if (!hasValue) {
            action.run();
        }
        return this;
    }
    
    // Convertir a Optional de Java
    public Optional<T> toOptional() {
        return hasValue ? Optional.of(value) : Optional.empty();
    }
    
    // Verificar si tiene valor
    public boolean isPresent() {
        return hasValue;
    }
    
    // Método toString
    @Override
    public String toString() {
        return hasValue ? "Just(" + value + ")" : "Nothing";
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Maybe<?> other = (Maybe<?>) obj;
        if (hasValue != other.hasValue) return false;
        return hasValue ? value.equals(other.value) : true;
    }
    
    @Override
    public int hashCode() {
        return hasValue ? 31 * value.hashCode() : 0;
    }
    
    // Clase de ejemplo de uso
    public static class MonadExample {
        // Función que puede fallar
        public static Maybe<Integer> divide(int a, int b) {
            if (b == 0) return Maybe.nothing();
            return Maybe.just(a / b);
        }
        
        // Otra función monádica
        public static Maybe<Integer> sqrt(int x) {
            if (x < 0) return Maybe.nothing();
            return Maybe.just((int) Math.sqrt(x));
        }
        
        public static void main(String[] args) {
            // Composición de operaciones usando bind
            Maybe<Integer> result1 = divide(10, 2)
                .bind(x -> sqrt(x))
                .map(x -> x * 10);
                
            Maybe<Integer> result2 = divide(10, 0)
                .bind(x -> sqrt(x))
                .map(x -> x * 10);
            
            // Manejo de casos con ifPresent/ifNothing
            result1
                .ifPresent(x -> System.out.println("Resultado: " + x))
                .ifNothing(() -> System.out.println("La operación falló"));
                
            result2
                .ifPresent(x -> System.out.println("Resultado: " + x))
                .ifNothing(() -> System.out.println("La operación falló"));
            
            // Uso con toOptional y API Stream de Java
            result1.toOptional()
                .map(x -> "El valor es: " + x)
                .ifPresent(System.out::println);
        }
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias para trabajar con funciones y valores opcionales.' },
        { line: 6, text: 'Definimos la clase genérica Maybe que implementa el patrón Mónada.' },
        { line: 7, text: 'Almacenamos el valor y un booleano para indicar si hay valor.' },
        { line: 10, text: 'Constructor privado: usamos el patrón Factory para crear instancias.' },
        { line: 16, text: 'Método factory para crear una mónada con valor (Just).' },
        { line: 17, text: 'Verificamos que el valor no sea null para mantener la semántica clara.' },
        { line: 23, text: 'Método factory para crear una mónada sin valor (Nothing).' },
        { line: 28, text: 'Método bind para encadenar operaciones monádicas, el método central de una mónada.' },
        { line: 29, text: 'Si hay valor, aplicamos la función y obtenemos una nueva mónada.' },
        { line: 31, text: 'Si no hay valor, retornamos Nothing (cortocircuito).' },
        { line: 37, text: 'Método map para transformar el valor dentro de la mónada.' },
        { line: 38, text: 'Si hay valor, aplicamos la función y envolvemos el resultado en Just.' },
        { line: 46, text: 'Método para obtener el valor o un valor por defecto.' },
        { line: 51, text: 'Método para obtener el valor o lanzar una excepción personalizada.' },
        { line: 59, text: 'Método para ejecutar un efecto (side-effect) solo si hay valor.' },
        { line: 66, text: 'Método para ejecutar un efecto solo si no hay valor.' },
        { line: 73, text: 'Método para convertir a Optional, la mónada incluida en Java estándar.' },
        { line: 78, text: 'Método para verificar si tiene valor.' },
        { line: 83, text: 'Sobrecargamos toString para mejor depuración.' },
        { line: 89, text: 'Implementamos equals para comparación correcta de mónadas.' },
        { line: 99, text: 'Implementamos hashCode para uso en colecciones.' },
        { line: 104, text: 'Clase de ejemplo de uso de la mónada.' },
        { line: 106, text: 'Función que puede fallar (división) y retorna una mónada.' },
        { line: 112, text: 'Otra función que puede fallar (raíz cuadrada de número negativo).' },
        { line: 118, text: 'Componemos operaciones encadenando bind y map.' },
        { line: 127, text: 'Usamos ifPresent/ifNothing para manejar los casos de éxito y fallo.' },
        { line: 134, text: 'Demostramos interoperabilidad con Optional y API Stream de Java.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Sintaxis y expresividad',
      cppTraditional: 'Implementación básica con std::optional y métodos explícitos como bind y map.',
      cppModern: 'Sintaxis más expresiva con sobrecarga de operadores (>>= y |), perfect forwarding y SFINAE.',
      java: 'API fluida con métodos encadenados como bind, map, ifPresent, etc., similar a Optional de Java.'
    },
    {
      title: 'Manejo de nulos',
      cppTraditional: 'Evita problemas de null mediante std::optional para representar ausencia de valor.',
      cppModern: 'Misma seguridad contra nulos que la versión tradicional, con mejor soporte para optimizaciones.',
      java: 'Prohíbe explícitamente valores null, forzando a usar nothing() para representar ausencia de valor.'
    },
    {
      title: 'Características avanzadas',
      cppTraditional: 'Implementación básica centrada en la funcionalidad esencial de una mónada.',
      cppModern: 'Añade métodos visit para pattern matching y soporte para rvalue references.',
      java: 'Incluye métodos adicionales como orElseThrow, ifPresent/ifNothing y conversión a Optional.'
    },
    {
      title: 'Optimizaciones',
      cppTraditional: 'Usa std::move para evitar copias innecesarias, pero sin optimizaciones avanzadas.',
      cppModern: 'Aprovecha perfect forwarding, move semantics y rvalue references para reducir copias.',
      java: 'Depende del JIT para optimizaciones. La inmutabilidad ayuda con la seguridad pero puede causar más objetos.'
    }
  ],
  
  notes: 'El patrón Mónada es fundamental en programación funcional para manejar efectos secundarios de forma controlada. Las mónadas más comunes incluyen Maybe/Option (para valores opcionales), Either/Result (para operaciones que pueden fallar con información del error), List (para colecciones), Promise/Future (para operaciones asíncronas), State (para estado inmutable) y IO (para operaciones de entrada/salida). Cada mónada debe cumplir con tres leyes monádicas: identidad a izquierda, identidad a derecha y asociatividad. En lenguajes sin soporte nativo para mónadas, la implementación suele ser más verbosa, pero aún así proporciona grandes beneficios. Bibliotecas como Cats (Scala), fp-ts (TypeScript) y Monads.NET (C#) proporcionan implementaciones robustas de mónadas para sus respectivos ecosistemas. En C++, bibliotecas como Boost.Hana y ranges-v3 ofrecen soporte para programación funcional incluyendo mónadas.'
};

export default monadPattern; 