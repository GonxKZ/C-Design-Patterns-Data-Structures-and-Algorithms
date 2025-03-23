const curryingPattern = {
  id: 'currying',
  name: 'Currying',
  category: 'functional',
  description: 'Transforma una función que toma múltiples argumentos en una secuencia de funciones, cada una tomando un solo argumento. Permite la aplicación parcial de funciones y la creación de funciones más especializadas.',
  
  theory: {
    background: 'El currying toma su nombre del lógico Haskell Curry, aunque el concepto fue introducido por Moses Schönfinkel y Gottlob Frege. Es fundamental en lenguajes funcionales como Haskell y se considera una técnica central de la programación funcional.',
    problem: 'Las funciones de varios argumentos son menos flexibles para la composición y reutilización. A menudo necesitamos especializar funciones fijando algunos argumentos mientras dejamos otros variables.',
    solution: 'Transformar una función f(x,y,z) en una función currificada f(x)(y)(z), lo que permite aplicar argumentos uno a uno y crear funciones parcialmente aplicadas en cada paso.',
    applicability: [
      'Cuando se necesita crear funciones especializadas a partir de funciones más generales',
      'Para facilitar la composición de funciones',
      'En situaciones donde se desea aplicar algunos argumentos ahora y otros más tarde',
      'Para implementar arquitecturas de programación funcional en lenguajes imperativos',
      'En bibliotecas de procesamiento de datos y manipulación de colecciones'
    ],
    consequences: [
      'Aumenta la flexibilidad y reutilización del código',
      'Facilita la creación de funciones de orden superior',
      'Puede complicar la comprensión del código para programadores no familiarizados con técnicas funcionales',
      'Potencial impacto en rendimiento por las múltiples llamadas a función en algunos lenguajes'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <functional>
#include <string>
#include <vector>

// Enfoque tradicional sin currificación
int add(int a, int b) {
    return a + b;
}

// Versión currificada manual
std::function<int(int)> addCurried(int a) {
    return [a](int b) {
        return a + b;
    };
}

// Función para currificar funciones de 2 argumentos
template<typename A, typename B, typename R>
std::function<std::function<R(B)>(A)> curry2(R(*func)(A, B)) {
    return [func](A a) {
        return [func, a](B b) {
            return func(a, b);
        };
    };
}

// Función para currificar funciones de 3 argumentos
template<typename A, typename B, typename C, typename R>
std::function<std::function<std::function<R(C)>(B)>(A)> curry3(R(*func)(A, B, C)) {
    return [func](A a) {
        return [func, a](B b) {
            return [func, a, b](C c) {
                return func(a, b, c);
            };
        };
    };
}

// Ejemplos para demostrar el uso

// Función de ejemplo con 2 argumentos
int multiply(int a, int b) {
    return a * b;
}

// Función de ejemplo con 3 argumentos
std::string formatName(const std::string& title, const std::string& first, const std::string& last) {
    return title + ". " + first + " " + last;
}

// Función para aplicar una función a cada elemento de un vector
template<typename T, typename R>
std::vector<R> map(const std::vector<T>& items, std::function<R(T)> func) {
    std::vector<R> result;
    result.reserve(items.size());
    
    for (const auto& item : items) {
        result.push_back(func(item));
    }
    
    return result;
}

int main() {
    // Uso básico de currificación
    std::cout << "=== Currificación básica ===" << std::endl;
    
    // Versión no currificada
    std::cout << "add(3, 4) = " << add(3, 4) << std::endl;
    
    // Versión currificada manual
    std::function<int(int)> add3 = addCurried(3);
    std::cout << "addCurried(3)(4) = " << add3(4) << std::endl;
    
    // Usando curry2 para currificar multiply
    auto curriedMultiply = curry2(multiply);
    auto multiplyBy5 = curriedMultiply(5);
    std::cout << "curriedMultiply(5)(6) = " << multiplyBy5(6) << std::endl;
    
    // Usando curry3 para currificar formatName
    auto curriedFormat = curry3(formatName);
    auto formatDr = curriedFormat("Dr");
    auto formatDrJohn = formatDr("John");
    std::cout << "curriedFormat(\"Dr\")(\"John\")(\"Smith\") = " << formatDrJohn("Smith") << std::endl;
    
    // Aplicación práctica: uso con map
    std::cout << "\\n=== Aplicación práctica con map ===" << std::endl;
    
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    // Usar función currificada con map
    auto times2 = curriedMultiply(2);
    auto doubled = map(numbers, times2);
    
    std::cout << "Original: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    
    std::cout << "Doubled: ";
    for (int n : doubled) std::cout << n << " ";
    std::cout << std::endl;
    
    // Crear múltiples funciones especializadas
    auto plus10 = addCurried(10);
    auto times10 = curriedMultiply(10);
    
    // Aplicar ambas transformaciones
    auto added10 = map(numbers, plus10);
    auto multiplied10 = map(numbers, times10);
    
    std::cout << "Added 10: ";
    for (int n : added10) std::cout << n << " ";
    std::cout << std::endl;
    
    std::cout << "Multiplied by 10: ";
    for (int n : multiplied10) std::cout << n << " ";
    std::cout << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 6, text: "Función tradicional 'add' que toma dos argumentos." },
        { line: 11, text: "Versión currificada manual de 'add', que devuelve una función que toma el segundo argumento." },
        { line: 18, text: "Función genérica 'curry2' para currificar cualquier función de dos argumentos." },
        { line: 27, text: "Función 'curry3' para currificar funciones de tres argumentos, mostrando el patrón anidado." },
        { line: 40, text: "Función de ejemplo 'multiply' que será currificada." },
        { line: 45, text: "Función de ejemplo 'formatName' con tres argumentos para demostrar curry3." },
        { line: 50, text: "Función 'map' para demostrar el uso práctico de funciones currificadas con colecciones." },
        { line: 73, text: "Creación de una función especializada 'add3' mediante currificación." },
        { line: 78, text: "Uso de curry2 para crear la función especializada 'multiplyBy5'." },
        { line: 83, text: "Demostración de curry3, creando funciones cada vez más especializadas." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <functional>
#include <string>
#include <vector>
#include <tuple>
#include <type_traits>

// Implementación moderna de currying usando C++17

// Variadic template para currificar cualquier función de N argumentos
template<typename Func, typename... CapturedArgs>
class Curried {
private:
    Func func;
    std::tuple<CapturedArgs...> captured_args;
    
    // Función helper para invocar func con argumentos combinados
    template<typename... NewArgs, size_t... I>
    auto invoke_impl(std::index_sequence<I...>, NewArgs&&... new_args) const {
        return func(std::get<I>(captured_args)..., std::forward<NewArgs>(new_args)...);
    }
    
public:
    Curried(Func f, CapturedArgs... args) 
        : func(std::move(f)), captured_args(std::make_tuple(std::move(args)...)) {}
    
    // Caso base: llamar a la función con todos los argumentos
    template<typename... NewArgs, 
             typename = std::enable_if_t<
                 std::is_invocable_v<Func, CapturedArgs..., NewArgs...> &&
                 !std::is_same_v<void, std::invoke_result_t<Func, CapturedArgs..., NewArgs...>>
             >>
    auto operator()(NewArgs&&... new_args) const {
        return invoke_impl(std::index_sequence_for<CapturedArgs...>{}, 
                           std::forward<NewArgs>(new_args)...);
    }
    
    // Caso recursivo: capturar más argumentos
    template<typename Arg, 
             typename... NewArgs,
             typename = std::enable_if_t<
                 !std::is_invocable_v<Func, CapturedArgs..., Arg, NewArgs...>
             >>
    auto operator()(Arg&& arg, NewArgs&&... new_args) const {
        auto new_curried = Curried<Func, CapturedArgs..., std::decay_t<Arg>>(
            func, std::get<CapturedArgs>(captured_args)..., std::forward<Arg>(arg)
        );
        
        if constexpr (sizeof...(NewArgs) > 0) {
            return new_curried(std::forward<NewArgs>(new_args)...);
        } else {
            return new_curried;
        }
    }
};

// Helper para crear objetos Curried
template<typename Func>
auto curry(Func&& f) {
    return Curried<std::decay_t<Func>>(std::forward<Func>(f));
}

// Función de ejemplo con dos argumentos
auto add = [](int a, int b) { return a + b; };

// Función de ejemplo con tres argumentos
auto multiply = [](int a, int b, int c) { return a * b * c; };

// Función compleja con múltiples argumentos
auto formatPerson = [](const std::string& title, const std::string& first, 
                     const std::string& last, int age, const std::string& city) {
    return title + ". " + first + " " + last + " (" + std::to_string(age) + ") from " + city;
};

// Función map para colecciones
template<typename Container, typename Func>
auto map(const Container& items, Func func) {
    std::vector<std::invoke_result_t<Func, typename Container::value_type>> result;
    result.reserve(items.size());
    
    for (const auto& item : items) {
        result.push_back(func(item));
    }
    
    return result;
}

// Función para imprimir vectores
template<typename T>
void printVector(const std::vector<T>& vec, const std::string& label) {
    std::cout << label << ": ";
    for (const auto& item : vec) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::cout << "=== Currying con C++ moderno ===" << std::endl;
    
    // Currificar función add
    auto curriedAdd = curry(add);
    
    // Aplicación parcial
    auto add5 = curriedAdd(5);
    std::cout << "add5(10) = " << add5(10) << std::endl;
    
    // Aplicación completa en un paso
    std::cout << "curriedAdd(3)(4) = " << curriedAdd(3)(4) << std::endl;
    
    // Currificar función multiply
    auto curriedMultiply = curry(multiply);
    
    // Aplicación progresiva
    auto mul2 = curriedMultiply(2);
    auto mul2_3 = mul2(3);
    std::cout << "curriedMultiply(2)(3)(4) = " << mul2_3(4) << std::endl;
    
    // Currificar función compleja
    auto curriedFormat = curry(formatPerson);
    
    // Especialización progresiva
    auto formatDr = curriedFormat("Dr");
    auto formatDrJane = formatDr("Jane");
    auto formatDrJaneDoe = formatDrJane("Doe");
    auto formatDrJaneDoe30 = formatDrJaneDoe(30);
    
    std::cout << "Formato completo: " << formatDrJaneDoe30("New York") << std::endl;
    
    // Crear múltiples especialistas a partir de la misma base
    auto formatProf = curriedFormat("Prof");
    auto formatMrs = curriedFormat("Mrs");
    
    std::cout << "Diferentes títulos:" << std::endl;
    std::cout << formatProf("Alan")("Turing")(41)("Cambridge") << std::endl;
    std::cout << formatMrs("Grace")("Hopper")(85)("Arlington") << std::endl;
    
    // Aplicación práctica con map
    std::cout << "\\n=== Aplicación práctica con map ===" << std::endl;
    
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    printVector(numbers, "Original");
    
    // Usar diferentes funciones currificadas con map
    auto doubled = map(numbers, curriedAdd(curriedMultiply(2)(1))(0));
    printVector(doubled, "Doubled");
    
    auto multipliedBy10 = map(numbers, curriedMultiply(10)(1));
    printVector(multipliedBy10, "Multiplied by 10");
    
    // Composición de funciones currificadas
    auto addThenMultiply = [&](int n) { return curriedMultiply(2)(2)(add5(n)); };
    auto transformed = map(numbers, addThenMultiply);
    printVector(transformed, "Add 5 then multiply by 4");
    
    return 0;
}`,
      explanation: [
        { line: 8, text: "Implementación avanzada de currying usando templates variadicos de C++17." },
        { line: 15, text: "Función auxiliar para desempaquetar argumentos capturados usando std::index_sequence." },
        { line: 24, text: "Sobrecarga de operator() para el caso base, donde se invoca la función con todos los argumentos." },
        { line: 36, text: "Sobrecarga de operator() para el caso recursivo, donde se capturan más argumentos." },
        { line: 53, text: "Función helper 'curry' que facilita la creación de objetos Curried." },
        { line: 56, text: "Funciones de ejemplo usando lambdas, características de C++ moderno." },
        { line: 66, text: "Función map mejorada que deduce automáticamente el tipo de retorno usando std::invoke_result_t." },
        { line: 95, text: "Demostración de currificación con aplicación parcial y especialización progresiva." },
        { line: 111, text: "Creación de múltiples funciones especializadas a partir de la misma base." },
        { line: 131, text: "Ejemplo de composición de funciones currificadas para transformaciones complejas." }
      ]
    },
    java: {
      code: `import java.util.Arrays;
import java.util.List;
import java.util.function.*;
import java.util.stream.Collectors;

public class CurryingDemo {
    
    // Interfaces funcionales para currying
    
    // Currificación para funciones de 2 argumentos
    @FunctionalInterface
    interface Function2<A, B, R> {
        R apply(A a, B b);
        
        default Function<B, R> curry(A a) {
            return b -> apply(a, b);
        }
    }
    
    // Currificación para funciones de 3 argumentos
    @FunctionalInterface
    interface Function3<A, B, C, R> {
        R apply(A a, B b, C c);
        
        default Function<C, R> curry(A a, B b) {
            return c -> apply(a, b, c);
        }
        
        default BiFunction<B, C, R> curry(A a) {
            return (b, c) -> apply(a, b, c);
        }
        
        default Function<B, Function<C, R>> curryAll(A a) {
            return b -> c -> apply(a, b, c);
        }
    }
    
    // Métodos de utilidad para currificación
    
    // Currificar BiFunction a Function<A, Function<B, R>>
    public static <A, B, R> Function<A, Function<B, R>> curry(BiFunction<A, B, R> func) {
        return a -> b -> func.apply(a, b);
    }
    
    // Currificar Function2 a Function<A, Function<B, R>>
    public static <A, B, R> Function<A, Function<B, R>> curry(Function2<A, B, R> func) {
        return a -> b -> func.apply(a, b);
    }
    
    // Currificar Function3 a Function<A, Function<B, Function<C, R>>>
    public static <A, B, C, R> Function<A, Function<B, Function<C, R>>> curry(Function3<A, B, C, R> func) {
        return a -> b -> c -> func.apply(a, b, c);
    }
    
    // Ejemplos de funciones para currificar
    
    // Funciones de dos argumentos
    static int add(int a, int b) {
        return a + b;
    }
    
    static int multiply(int a, int b) {
        return a * b;
    }
    
    // Función de tres argumentos
    static String formatName(String title, String firstName, String lastName) {
        return title + ". " + firstName + " " + lastName;
    }
    
    // Función de cinco argumentos
    static String formatPerson(String title, String firstName, String lastName, 
                              int age, String city) {
        return title + ". " + firstName + " " + lastName + " (" + 
               age + ") from " + city;
    }
    
    // Método principal con ejemplos
    public static void main(String[] args) {
        System.out.println("=== Currying en Java ===");
        
        // Ejemplo 1: Currying con BiFunction estándar
        System.out.println("--- Usando BiFunction ---");
        
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        Function<Integer, Function<Integer, Integer>> curriedAdd = curry(add);
        
        // Aplicación parcial
        Function<Integer, Integer> add5 = curriedAdd.apply(5);
        System.out.println("add5(10) = " + add5.apply(10));
        
        // Aplicación completa
        System.out.println("curriedAdd(3)(4) = " + curriedAdd.apply(3).apply(4));
        
        // Ejemplo 2: Usando nuestras interfaces personalizadas
        System.out.println("\\n--- Usando interfaces personalizadas ---");
        
        Function2<Integer, Integer, Integer> multiply = CurryingDemo::multiply;
        
        // Usando curry directo del método
        Function<Integer, Integer> multiplyBy7 = multiply.curry(7);
        System.out.println("multiply.curry(7)(6) = " + multiplyBy7.apply(6));
        
        // Usando curry helper
        Function<Integer, Function<Integer, Integer>> curriedMultiply = curry(multiply);
        System.out.println("curriedMultiply(3)(4) = " + curriedMultiply.apply(3).apply(4));
        
        // Ejemplo 3: Currying con Function3
        System.out.println("\\n--- Currying de 3 argumentos ---");
        
        Function3<String, String, String, String> format = CurryingDemo::formatName;
        
        // Currificación parcial
        BiFunction<String, String, String> formatDr = format.curry("Dr");
        System.out.println("formatDr.apply(\"John\", \"Smith\") = " + 
                          formatDr.apply("John", "Smith"));
        
        // Currificación completa
        Function<String, Function<String, Function<String, String>>> curriedFormat = curry(format);
        
        // Especialización progresiva
        Function<String, Function<String, String>> formatMrs = curriedFormat.apply("Mrs");
        Function<String, String> formatMrsJane = formatMrs.apply("Jane");
        String result = formatMrsJane.apply("Doe");
        
        System.out.println("curriedFormat(\"Mrs\")(\"Jane\")(\"Doe\") = " + result);
        
        // Ejemplo 4: Aplicación práctica con streams
        System.out.println("\\n--- Aplicación con streams ---");
        
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        
        // Transformar usando funciones currificadas
        List<Integer> doubled = numbers.stream()
            .map(curriedAdd.apply(curriedMultiply.apply(2).apply(0)))
            .collect(Collectors.toList());
        
        System.out.println("Original: " + numbers);
        System.out.println("Doubled: " + doubled);
        
        // Crear múltiples transformaciones desde la misma base
        Function<Integer, Integer> addThen = add5;
        Function<Integer, Integer> multiplyThen = curriedMultiply.apply(3);
        
        List<Integer> transformed = numbers.stream()
            .map(addThen.andThen(multiplyThen))
            .collect(Collectors.toList());
        
        System.out.println("Add 5 then multiply by 3: " + transformed);
        
        // Ejemplo 5: Composición de funciones currificadas
        System.out.println("\\n--- Composición de funciones ---");
        
        // Crear una función compuesta: (a + 5) * (b * 2)
        BiFunction<Integer, Integer, Integer> complexOp = 
            (a, b) -> add5.apply(a) * curriedMultiply.apply(2).apply(b);
        
        System.out.println("complexOp(10, 5) = " + complexOp.apply(10, 5));
    }
}`,
      explanation: [
        { line: 9, text: "Interfaz funcional personalizada Function2 para funciones de 2 argumentos con método curry." },
        { line: 19, text: "Interfaz Function3 para funciones de 3 argumentos con múltiples métodos de currificación." },
        { line: 38, text: "Método estático para currificar BiFunction estándar de Java." },
        { line: 43, text: "Método para currificar Function2 personalizada, generando currificación completa." },
        { line: 53, text: "Ejemplos de funciones con diferente número de argumentos para demostrar currificación." },
        { line: 75, text: "Ejemplo de currificación con BiFunction estándar de Java." },
        { line: 92, text: "Demostración de nuestras interfaces personalizadas con métodos curry incorporados." },
        { line: 107, text: "Ejemplo de currificación con 3 argumentos mostrando especialización progresiva." },
        { line: 126, text: "Aplicación práctica con Java streams, mostrando cómo se integra con APIs funcionales." },
        { line: 151, text: "Ejemplo de composición de funciones currificadas para crear operaciones complejas." }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Sintaxis y legibilidad',
      cppTraditional: 'Implementación verbosa que requiere conocimientos de templates y lambdas anidadas.',
      cppModern: 'Más elegante con C++17, pero aún compleja debido a la sobrecarga de operadores y SFINAE.',
      java: 'Más natural con interfaces funcionales y métodos default, aunque aún verbosa comparada con lenguajes funcionales puros.'
    },
    {
      title: 'Integración con el ecosistema',
      cppTraditional: 'Requiere adaptar manualmente las funciones del ecosistema de C++ para usar currificación.',
      cppModern: 'Mejor integración con std::function y lambdas, pero sin soporte nativo en la biblioteca estándar.',
      java: 'Bien integrado con java.util.function y API Stream para operaciones funcionales.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Limitada por los templates manuales para número específico de argumentos.',
      cppModern: 'Alta flexibilidad con templates variadicos y fold expressions de C++17.',
      java: 'Algo limitada por el sistema de tipos, pero los genéricos y las interfaces funcionales proporcionan buena flexibilidad.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Bueno con optimización, aunque las múltiples lambdas anidadas pueden impactar.',
      cppModern: 'Excelente, ya que muchas construcciones se pueden optimizar en tiempo de compilación.',
      java: 'Algo más lento debido a la indirección de las interfaces funcionales y boxing/unboxing de tipos primitivos.'
    }
  ],
  
  notes: 'El currying es una técnica fundamental en la programación funcional que permite crear funciones especializadas desde funciones generales. A pesar de que lenguajes como C++ y Java no fueron diseñados inicialmente con este paradigma en mente, las características modernas de ambos permiten implementar currying de manera efectiva. En lenguajes funcionales como Haskell, todas las funciones están currificadas por defecto, lo que hace la composición y especialización mucho más natural. La técnica es especialmente útil en procesamiento de datos, ya que permite crear fácilmente transformaciones específicas y reutilizarlas en diferentes contextos. El patrón es complementario a otras técnicas funcionales como la composición de funciones y la aplicación parcial.'
};

export default curryingPattern; 