const compositionPattern = {
  id: 'composition',
  name: 'Composición Funcional',
  category: 'functional',
  description: 'Combina dos o más funciones para crear una nueva función que aplica las funciones compuestas en secuencia.',
  theory: {
    background: 'La composición funcional es un concepto central en la programación funcional, derivado de la teoría de categorías matemáticas, donde funciones pueden componerse como operaciones matemáticas.',
    problem: 'Cuando tenemos múltiples transformaciones de datos que necesitan aplicarse en secuencia, el código puede volverse difícil de leer y mantener si cada transformación se aplica separadamente.',
    solution: 'Crear una función de orden superior que tome múltiples funciones como entrada y devuelva una nueva función que aplica estas funciones en secuencia, donde la salida de cada función se pasa como entrada a la siguiente.',
    applicability: [
      'Transformaciones de datos en cadena',
      'Construcción de pipelines de procesamiento',
      'Simplificación de múltiples operaciones secuenciales',
      'Creación de funciones reutilizables a partir de funciones más simples',
      'Implementación de flujos de trabajo sin estado'
    ],
    consequences: [
      'Mayor legibilidad al eliminar variables intermedias',
      'Mejor reutilización de código al construir funciones complejas a partir de simples',
      'Facilita el razonamiento sobre el código al separar las transformaciones',
      'Puede aumentar la sobrecarga de rendimiento debido a múltiples llamadas a funciones',
      'Puede ser difícil de entender para desarrolladores no familiarizados con programación funcional'
    ]
  },
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <functional>
#include <algorithm>

// Función de composición básica para dos funciones
template<typename F, typename G>
auto compose(F f, G g) {
    return [=](auto x) {
        return f(g(x));
    };
}

// Función de composición variádica para múltiples funciones
template<typename F>
auto compose_all(F f) {
    return f;
}

template<typename F, typename... Args>
auto compose_all(F f, Args... args) {
    return [=](auto x) {
        return f(compose_all(args...)(x));
    };
}

// Ejemplos de funciones para componer
int double_value(int x) {
    return x * 2;
}

int add_ten(int x) {
    return x + 10;
}

std::string to_string(int x) {
    return "El resultado es: " + std::to_string(x);
}

// Función de demostración
void demonstrate_composition() {
    // Composición de dos funciones
    auto add_ten_then_double = compose(double_value, add_ten);
    std::cout << "add_ten_then_double(5): " << add_ten_then_double(5) << std::endl;  // (5+10)*2 = 30
    
    // Composición de tres funciones
    auto process_number = compose_all(to_string, double_value, add_ten);
    std::cout << process_number(5) << std::endl;  // "El resultado es: 30"
    
    // Ejemplo con vectores
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::vector<std::string> results;
    
    std::transform(numbers.begin(), numbers.end(), 
                  std::back_inserter(results),
                  process_number);
    
    std::cout << "Resultados procesados:" << std::endl;
    for (const auto& result : results) {
        std::cout << result << std::endl;
    }
}

int main() {
    demonstrate_composition();
    return 0;
}`,
      explanation: [
        { line: 1, text: "Incluimos las cabeceras necesarias para std::string, std::vector, std::function y algoritmos." },
        { line: 7, text: "Definimos una función template 'compose' que combina dos funciones f y g." },
        { line: 8, text: "La función devuelve una lambda que captura f y g por valor." },
        { line: 9, text: "La lambda aplica g primero y luego f al resultado (composición de derecha a izquierda)." },
        { line: 14, text: "Caso base para compose_all con una sola función." },
        { line: 19, text: "Template variádico para compose_all que maneja múltiples funciones." },
        { line: 20, text: "Lambda que aplica f a la composición de las funciones restantes." },
        { line: 25, text: "Ejemplo de función que duplica un valor." },
        { line: 29, text: "Ejemplo de función que suma 10 a un valor." },
        { line: 33, text: "Función que convierte un entero a string con un mensaje." },
        { line: 38, text: "Función para demostrar el uso de la composición." },
        { line: 40, text: "Componemos double_value y add_ten." },
        { line: 43, text: "Composición de tres funciones usando compose_all." },
        { line: 46, text: "Ejemplo de aplicación con vectores." },
        { line: 50, text: "Transformamos cada número aplicando la función compuesta." },
        { line: 60, text: "Función principal que ejecuta la demostración." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <functional>
#include <algorithm>
#include <type_traits>

// Operador de composición (similar al operador >> en F#)
template<typename F, typename G>
auto operator|(G g, F f) {
    return [=](auto&&... args) -> decltype(f(g(std::forward<decltype(args)>(args)...))) {
        return f(g(std::forward<decltype(args)>(args)...));
    };
}

// Función pipe para mejorar la legibilidad (de izquierda a derecha)
template<typename T, typename... Fs>
auto pipe(T&& x, Fs&&... fs) {
    auto combined = (... | fs); // Pliegue de expresiones (C++17)
    return combined(std::forward<T>(x));
}

// Creación de un pipeline reutilizable
template<typename... Fs>
auto make_pipeline(Fs&&... fs) {
    return [=](auto&& x) -> decltype(pipe(std::forward<decltype(x)>(x), fs...)) {
        return pipe(std::forward<decltype(x)>(x), fs...);
    };
}

// Funciones para componer
auto double_value = [](int x) { return x * 2; };
auto add_ten = [](int x) { return x + 10; };
auto to_string = [](int x) { return "El resultado es: " + std::to_string(x); };

// Funciones de orden superior para crear funciones parcialmente aplicadas
auto add = [](int a) {
    return [a](int b) {
        return a + b;
    };
};

auto multiply = [](int a) {
    return [a](int b) {
        return a * b;
    };
};

// Demostración de composición moderna
void demonstrate_modern_composition() {
    // Composición usando el operador | personalizado
    auto process = add_ten | double_value | to_string;
    std::cout << process(5) << std::endl;  // "El resultado es: 30"
    
    // Usando pipe para mayor claridad
    auto result = pipe(5, add_ten, double_value, to_string);
    std::cout << result << std::endl;  // "El resultado es: 30"
    
    // Creando un pipeline reutilizable
    auto number_processor = make_pipeline(add_ten, double_value, to_string);
    std::cout << number_processor(5) << std::endl;  // "El resultado es: 30"
    
    // Combinando con funciones parcialmente aplicadas
    auto add_five = add(5);
    auto multiply_by_three = multiply(3);
    
    auto complex_process = make_pipeline(
        add_five,         // x + 5
        multiply_by_three, // (x + 5) * 3
        add(2),           // ((x + 5) * 3) + 2
        to_string         // "El resultado es: ((x + 5) * 3) + 2"
    );
    
    std::cout << complex_process(10) << std::endl;  // "El resultado es: 47"
    
    // Procesando una colección
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::vector<std::string> results;
    
    std::transform(numbers.begin(), numbers.end(), 
                  std::back_inserter(results),
                  number_processor);
    
    std::cout << "Resultados procesados con pipeline:" << std::endl;
    for (const auto& result : results) {
        std::cout << result << std::endl;
    }
}

int main() {
    demonstrate_modern_composition();
    return 0;
}`,
      explanation: [
        { line: 1, text: "Incluimos las cabeceras estándar, incluyendo <type_traits> para metaprogramación de tipos." },
        { line: 8, text: "Definimos un operador | personalizado para composición de funciones." },
        { line: 10, text: "El operador devuelve una lambda que captura las funciones y usa perfect forwarding." },
        { line: 16, text: "Función pipe que aplica una serie de funciones en secuencia (de izquierda a derecha)." },
        { line: 18, text: "Usamos un pliegue de expresiones de C++17 para combinar todas las funciones." },
        { line: 24, text: "Función para crear un pipeline reutilizable de funciones." },
        { line: 25, text: "Devuelve una lambda que aplica las funciones a un valor usando pipe." },
        { line: 31, text: "Definimos funciones como lambdas, facilitando su uso como valores." },
        { line: 36, text: "Creamos una función de orden superior 'add' que devuelve una función parcialmente aplicada." },
        { line: 42, text: "Similar a add, pero para multiplicación." },
        { line: 48, text: "Función para demostrar las técnicas modernas de composición." },
        { line: 50, text: "Usamos el operador | personalizado para componer funciones." },
        { line: 54, text: "Usamos pipe para mayor claridad en la dirección de procesamiento." },
        { line: 58, text: "Creamos un pipeline reutilizable con make_pipeline." },
        { line: 61, text: "Creamos funciones parcialmente aplicadas." },
        { line: 64, text: "Componemos un proceso complejo combinando varias funciones." },
        { line: 72, text: "Aplicamos el pipeline a un valor." },
        { line: 75, text: "Procesamos una colección usando el pipeline y std::transform." },
        { line: 87, text: "Función principal que ejecuta la demostración." }
      ]
    },
    java: {
      code: `import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class FunctionalComposition {
    
    // Método auxiliar para componer dos funciones
    public static <A, B, C> Function<A, C> compose(Function<B, C> f, Function<A, B> g) {
        return a -> f.apply(g.apply(a));
    }
    
    // Método para demostrar la composición
    public static void demonstrateComposition() {
        // Funciones simples
        Function<Integer, Integer> addTen = x -> x + 10;
        Function<Integer, Integer> doubleValue = x -> x * 2;
        Function<Integer, String> convertToString = x -> "El resultado es: " + x;
        
        // Composición manual
        Function<Integer, String> processManual = x -> convertToString.apply(doubleValue.apply(addTen.apply(x)));
        System.out.println(processManual.apply(5));  // "El resultado es: 30"
        
        // Usando el método compose
        Function<Integer, String> processComposed = compose(convertToString, compose(doubleValue, addTen));
        System.out.println(processComposed.apply(5));  // "El resultado es: 30"
        
        // Usando los métodos compose y andThen de Function
        Function<Integer, String> processWithAndThen = addTen.andThen(doubleValue).andThen(convertToString);
        System.out.println(processWithAndThen.apply(5));  // "El resultado es: 30"
        
        // Procesando una colección
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        List<String> results = numbers.stream()
                                    .map(processWithAndThen)
                                    .collect(Collectors.toList());
        
        System.out.println("Resultados procesados:");
        results.forEach(System.out::println);
    }
    
    // Clase anidada para demostrar una implementación más avanzada
    public static class Pipeline<T, R> {
        private final Function<T, R> function;
        
        private Pipeline(Function<T, R> function) {
            this.function = function;
        }
        
        public static <T> Pipeline<T, T> start() {
            return new Pipeline<>(Function.identity());
        }
        
        public <V> Pipeline<T, V> pipe(Function<R, V> next) {
            return new Pipeline<>(function.andThen(next));
        }
        
        public R apply(T input) {
            return function.apply(input);
        }
    }
    
    // Demostración de la clase Pipeline
    public static void demonstratePipeline() {
        var addFive = (Function<Integer, Integer>) (x -> x + 5);
        var multiplyByThree = (Function<Integer, Integer>) (x -> x * 3);
        var addTwo = (Function<Integer, Integer>) (x -> x + 2);
        var toString = (Function<Integer, String>) (x -> "El resultado es: " + x);
        
        // Creando un pipeline reutilizable
        var pipeline = Pipeline.<Integer>start()
                                .pipe(addFive)         // x + 5
                                .pipe(multiplyByThree) // (x + 5) * 3
                                .pipe(addTwo)          // ((x + 5) * 3) + 2
                                .pipe(toString);       // "El resultado es: ((x + 5) * 3) + 2"
        
        System.out.println(pipeline.apply(10));  // "El resultado es: 47"
        
        // Procesando una colección con el pipeline
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        List<String> results = numbers.stream()
                                    .map(pipeline::apply)
                                    .collect(Collectors.toList());
        
        System.out.println("Resultados procesados con pipeline:");
        results.forEach(System.out::println);
    }
    
    public static void main(String[] args) {
        System.out.println("==== Demostración de Composición Básica ====");
        demonstrateComposition();
        
        System.out.println("\n==== Demostración de Pipeline ====");
        demonstratePipeline();
    }
}`,
      explanation: [
        { line: 1, text: "Importamos las clases necesarias, incluyendo Function para funciones de orden superior." },
        { line: 6, text: "Definimos la clase FunctionalComposition para demostrar el patrón." },
        { line: 9, text: "Método estático para componer dos funciones." },
        { line: 10, text: "Retorna una nueva función que aplica g y luego f." },
        { line: 14, text: "Método para demostrar diferentes formas de composición." },
        { line: 16, text: "Definimos funciones simples como expresiones lambda." },
        { line: 21, text: "Composición manual anidando llamadas a apply." },
        { line: 25, text: "Usando nuestro método compose para componer funciones." },
        { line: 29, text: "Usando los métodos andThen proporcionados por la interfaz Function." },
        { line: 33, text: "Procesamos una colección usando streams y la función compuesta." },
        { line: 41, text: "Definimos una clase anidada Pipeline para una implementación más avanzada." },
        { line: 46, text: "Método estático factory para crear un pipeline con la función identidad." },
        { line: 50, text: "Método pipe para añadir una nueva función al pipeline." },
        { line: 54, text: "Método apply para ejecutar el pipeline con una entrada." },
        { line: 59, text: "Método para demostrar la clase Pipeline." },
        { line: 60, text: "Definimos funciones como variables para mejorar la legibilidad." },
        { line: 66, text: "Creamos un pipeline encadenando llamadas a pipe." },
        { line: 73, text: "Aplicamos el pipeline a un valor." },
        { line: 76, text: "Procesamos una colección usando el pipeline." },
        { line: 85, text: "Función principal que ejecuta ambas demostraciones." }
      ]
    }
  },
  comparisons: [
    {
      title: 'Sintaxis y Claridad',
      cppTraditional: 'Usa templates y funciones como compose() y compose_all() que siguen la composición matemática (de derecha a izquierda).',
      cppModern: 'Utiliza un operador | personalizado y funciones como pipe() que permiten una lectura más natural (de izquierda a derecha).',
      java: 'Aprovecha los métodos compose() y andThen() de la interfaz Function, con una implementación adicional de Pipeline para una sintaxis fluida.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Limitada a composición de funciones con un solo argumento, aunque puede extenderse con trabajo adicional.',
      cppModern: 'Mayor flexibilidad con perfect forwarding y soporte para múltiples argumentos mediante plegado de expresiones (C++17).',
      java: 'Limitada por el diseño de las interfaces funcionales de Java, pero el patrón Pipeline añade flexibilidad.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Buen rendimiento con optimizaciones del compilador, pero múltiples niveles de llamadas a funciones.',
      cppModern: 'Similar al tradicional, pero con posibles mejoras por optimización de inline para lambdas.',
      java: 'Mayor sobrecarga debido al boxing/unboxing de tipos primitivos y la naturaleza del JVM.'
    },
    {
      title: 'Integración con el Ecosistema',
      cppTraditional: 'Funciona bien con algoritmos de la STL como std::transform.',
      cppModern: 'Integración perfecta con las características modernas de C++ y la STL.',
      java: 'Integración natural con Streams API y las interfaces funcionales de Java.'
    }
  ],
  notes: 'La composición funcional es un patrón fundamental en la programación funcional que permite construir funciones complejas a partir de funciones más simples. Es especialmente útil para crear pipelines de procesamiento de datos, eliminando la necesidad de variables intermedias y mejorando la legibilidad del código. En Java, la composición se facilita mediante la interfaz Function y los métodos compose() y andThen(). En C++, se pueden implementar operadores personalizados para una sintaxis más intuitiva. Aunque la composición puede introducir una pequeña sobrecarga de rendimiento debido a las múltiples llamadas a funciones, los compiladores modernos suelen optimizar estas operaciones mediante inline.'
};

export default compositionPattern; 