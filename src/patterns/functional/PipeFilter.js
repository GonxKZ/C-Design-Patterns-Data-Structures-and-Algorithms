const pipeFilterPattern = {
  id: 'pipe-filter',
  name: 'Pipe & Filter',
  category: 'functional',
  description: 'Conecta componentes de procesamiento (filtros) mediante canales de comunicación (pipes) para crear cadenas de transformación de datos, donde la salida de un componente sirve como entrada al siguiente.',
  theory: {
    background: 'El patrón Pipe & Filter tiene sus raíces en la programación de sistemas UNIX, donde el operador pipe (|) permite conectar la salida de un programa con la entrada de otro. En el contexto de la programación funcional, este patrón aprovecha la composición de funciones para crear flujos de procesamiento de datos modulares y mantenibles. Ha ganado popularidad en lenguajes modernos a través de operadores como |> en Elixir, F# y propuestas para JavaScript.',
    problem: 'Al procesar datos a través de múltiples transformaciones, los desarrolladores enfrentan desafíos como: 1) Código ilegible con transformaciones anidadas que se leen de adentro hacia afuera, 2) Dificultad para reutilizar fragmentos específicos de lógica de transformación, 3) Mantenimiento complejo cuando se necesita modificar el orden de operaciones, 4) Acoplamiento entre etapas de procesamiento, 5) Verbosidad al aplicar múltiples operaciones secuenciales a los mismos datos.',
    solution: 'Implementar un mecanismo para encadenar funciones donde cada una recibe la salida de la anterior, creando un flujo de datos lineal. La solución: a) Define funciones pequeñas y enfocadas (filtros) que realizan una única transformación, b) Proporciona un mecanismo (pipe) para componer estas funciones secuencialmente, c) Permite que los datos fluyan desde el principio hasta el final de la cadena, transformándose en cada paso, d) Facilita la reutilización de filtros en diferentes contextos y cadenas de procesamiento.',
    applicability: [
      'Procesamiento de datos que requiere múltiples transformaciones secuenciales',
      'Cuando se necesita mejorar la legibilidad de código con múltiples operaciones anidadas',
      'Escenarios donde las transformaciones individuales pueden reutilizarse en diferentes contextos',
      'Procesamiento de colecciones o streams de datos',
      'Cuando se requiere flexibilidad para reorganizar, añadir o eliminar pasos de procesamiento',
      'Implementación de flujos de trabajo con pasos bien definidos'
    ],
    consequences: [
      'Mayor legibilidad del código al expresar transformaciones en el orden de ejecución',
      'Mejor modularidad y reutilización de componentes de procesamiento',
      'Facilidad para modificar el orden o añadir/eliminar pasos de procesamiento',
      'Reducción de variables intermedias temporales para almacenar resultados parciales',
      'Posible impacto en el rendimiento debido a la creación de funciones intermedias',
      'Potencial dificultad para depurar si no se implementa correctamente'
    ]
  },
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <functional>
#include <algorithm>
#include <numeric>

// Implementación de pipe operator utilizando plantillas
template<typename T, typename F>
auto operator|(T&& value, F&& func) -> decltype(func(std::forward<T>(value))) {
    return func(std::forward<T>(value));
}

// Filtros reutilizables (funciones que procesan datos)
auto multiplicarPor(int factor) {
    return [factor](const std::vector<int>& nums) {
        std::vector<int> resultado(nums.size());
        std::transform(nums.begin(), nums.end(), resultado.begin(),
                      [factor](int x) { return x * factor; });
        return resultado;
    };
}

auto filtrarPares = [](const std::vector<int>& nums) {
    std::vector<int> resultado;
    std::copy_if(nums.begin(), nums.end(), std::back_inserter(resultado),
                [](int x) { return x % 2 == 0; });
    return resultado;
};

auto sumar = [](const std::vector<int>& nums) {
    return std::accumulate(nums.begin(), nums.end(), 0);
};

auto convertirAStrings = [](const std::vector<int>& nums) {
    std::vector<std::string> resultado;
    std::transform(nums.begin(), nums.end(), std::back_inserter(resultado),
                  [](int x) { return "Num: " + std::to_string(x); });
    return resultado;
};

auto imprimirVector = [](const auto& v) {
    for (const auto& item : v) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
    return v; // Retorna el vector para permitir encadenamiento
};

// Función de pipe que acepta múltiples funciones
template<typename T, typename... Fs>
auto pipe(T&& value, Fs&&... fs) {
    // Fold expression (C++17) para encadenar todas las funciones
    return (std::forward<T>(value) | ... | std::forward<Fs>(fs));
}

// Función para crear un pipeline
template<typename... Fs>
auto createPipeline(Fs&&... fs) {
    return [fs...](auto&& input) {
        return pipe(std::forward<decltype(input)>(input), fs...);
    };
}

int main() {
    std::vector<int> numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // Uso del operador pipe para encadenar operaciones
    std::cout << "Ejemplo 1 - Encadenamiento directo:" << std::endl;
    auto resultado1 = numeros 
                    | multiplicarPor(2)
                    | filtrarPares
                    | imprimirVector
                    | sumar;
    std::cout << "Suma total: " << resultado1 << std::endl;
    
    // Uso con pipe y funciones mixtas
    std::cout << "\nEjemplo 2 - Usando función pipe:" << std::endl;
    auto resultado2 = pipe(numeros,
                         multiplicarPor(3),
                         imprimirVector,
                         filtrarPares,
                         imprimirVector,
                         convertirAStrings,
                         imprimirVector);
    
    // Creación y uso de un pipeline reutilizable
    std::cout << "\nEjemplo 3 - Pipeline reutilizable:" << std::endl;
    auto procesadorNumeros = createPipeline(
        multiplicarPor(2),
        filtrarPares,
        imprimirVector,
        sumar
    );
    
    auto suma1 = procesadorNumeros(numeros);
    std::cout << "Suma del primer conjunto: " << suma1 << std::endl;
    
    std::vector<int> otrosNumeros = {5, 10, 15, 20, 25};
    auto suma2 = procesadorNumeros(otrosNumeros);
    std::cout << "Suma del segundo conjunto: " << suma2 << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 9, text: "Sobrecarga del operador | para crear el operador pipe que pasa un valor a una función." },
        { line: 14, text: "Implementación de un filtro que crea una función para multiplicar cada elemento por un factor." },
        { line: 23, text: "Filtro que selecciona solo los números pares de un vector." },
        { line: 30, text: "Filtro que suma todos los elementos de un vector." },
        { line: 34, text: "Filtro que convierte números a cadenas de texto con formato." },
        { line: 41, text: "Filtro utilitario para imprimir un vector y pasarlo al siguiente paso." },
        { line: 49, text: "Implementación de una función pipe que acepta múltiples funciones usando parameter pack." },
        { line: 56, text: "Función para crear un pipeline reutilizable que se puede aplicar a diferentes entradas." },
        { line: 64, text: "Vector de prueba para demostrar el uso de los pipes." },
        { line: 68, text: "Ejemplo de uso directo del operador | para encadenar operaciones." },
        { line: 77, text: "Ejemplo usando la función pipe para mayor flexibilidad." },
        { line: 86, text: "Creación de un pipeline reutilizable que se puede aplicar a diferentes conjuntos de datos." },
        { line: 93, text: "Aplicación del pipeline a un primer conjunto de datos." },
        { line: 96, text: "Aplicación del mismo pipeline a un segundo conjunto, demostrando la reutilización." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <vector>
#include <string>
#include <functional>
#include <algorithm>
#include <numeric>
#include <optional>
#include <variant>
#include <memory>
#include <type_traits>

// Tipo para representar un error en el pipeline
struct Error {
    std::string message;
    Error(std::string msg) : message(std::move(msg)) {}
};

// Tipo que puede contener un valor o un error
template<typename T>
using Result = std::variant<T, Error>;

// Funciones utilitarias para Result
template<typename T>
bool isSuccess(const Result<T>& result) {
    return std::holds_alternative<T>(result);
}

template<typename T>
T getValue(const Result<T>& result) {
    return std::get<T>(result);
}

template<typename T>
std::string getError(const Result<T>& result) {
    return std::get<Error>(result).message;
}

// Operador pipe para valores normales
template<typename T, typename F>
auto operator|(T&& value, F&& func) -> decltype(func(std::forward<T>(value))) {
    return func(std::forward<T>(value));
}

// Operador pipe especializado para manejar Result (similar a monads)
template<typename T, typename F>
auto operator|(Result<T> result, F&& func) {
    if (isSuccess(result)) {
        try {
            return func(getValue(result));
        } catch (const std::exception& e) {
            return Result<std::invoke_result_t<F, T>>(Error(e.what()));
        }
    }
    // Propaga el error sin aplicar la función
    return Result<std::invoke_result_t<F, T>>(Error(getError(result)));
}

// Función para crear un filtro con manejo de errores
template<typename F>
auto makeFilter(F&& f) {
    return [f = std::forward<F>(f)](auto&& input) -> Result<decltype(f(input))> {
        try {
            return f(std::forward<decltype(input)>(input));
        } catch (const std::exception& e) {
            return Error(e.what());
        }
    };
}

// Filtros reutilizables con manejo de errores
auto multiplicarPor(int factor) {
    return makeFilter([factor](const std::vector<int>& nums) {
        std::vector<int> resultado(nums.size());
        std::transform(nums.begin(), nums.end(), resultado.begin(),
                      [factor](int x) { return x * factor; });
        return resultado;
    });
}

auto filtrarPorCondicion(std::function<bool(int)> predicado, const std::string& descripcion) {
    return makeFilter([predicado, descripcion](const std::vector<int>& nums) {
        if (nums.empty()) throw std::runtime_error("Vector vacío en filtro: " + descripcion);
        
        std::vector<int> resultado;
        std::copy_if(nums.begin(), nums.end(), std::back_inserter(resultado), predicado);
        
        if (resultado.empty()) 
            throw std::runtime_error("No hay elementos que cumplan el criterio: " + descripcion);
            
        return resultado;
    });
}

auto sumar = makeFilter([](const std::vector<int>& nums) {
    if (nums.empty()) throw std::runtime_error("Intento de sumar un vector vacío");
    return std::accumulate(nums.begin(), nums.end(), 0);
});

auto imprimirVector = makeFilter([](const auto& v) {
    std::cout << "[ ";
    for (const auto& item : v) {
        std::cout << item << " ";
    }
    std::cout << "]" << std::endl;
    return v;
});

// Función para crear un pipeline resiliente
template<typename... Fs>
auto createPipeline(Fs&&... fs) {
    return [fs...](auto&& input) {
        // Convierte la entrada inicial a Result si es necesario
        auto result = std::is_same_v<std::decay_t<decltype(input)>, 
                                     Result<std::decay_t<decltype(getValue(input))>>>
                     ? std::forward<decltype(input)>(input)
                     : Result<std::decay_t<decltype(input)>>(std::forward<decltype(input)>(input));
                     
        // Aplica cada función en secuencia, manteniendo el manejo de errores
        return (result | ... | std::forward<Fs>(fs));
    };
}

// Función utilitaria para imprimir resultados
template<typename T>
void printResult(const Result<T>& result) {
    if (isSuccess(result)) {
        std::cout << "Éxito: " << getValue(result) << std::endl;
    } else {
        std::cout << "Error: " << getError(result) << std::endl;
    }
}

int main() {
    std::vector<int> numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    std::vector<int> vacio = {};
    
    auto filtrarPares = filtrarPorCondicion([](int x) { return x % 2 == 0; }, "números pares");
    auto filtrarMayoresQue = [](int umbral) {
        return filtrarPorCondicion(
            [umbral](int x) { return x > umbral; },
            "mayores que " + std::to_string(umbral)
        );
    };
    
    // Pipeline con manejo de errores
    std::cout << "Ejemplo 1 - Pipeline con manejo de errores:" << std::endl;
    auto pipeline = createPipeline(
        multiplicarPor(3),
        imprimirVector,
        filtrarPares,
        imprimirVector,
        sumar
    );
    
    auto resultado1 = pipeline(numeros);
    printResult(resultado1);
    
    // Caso de error - vector vacío
    std::cout << "\nEjemplo 2 - Manejo de error con vector vacío:" << std::endl;
    auto resultado2 = pipeline(vacio);
    printResult(resultado2);
    
    // Caso de error - ningún elemento cumple el filtro
    std::cout << "\nEjemplo 3 - Manejo de error cuando no hay coincidencias:" << std::endl;
    auto pipelineExigente = createPipeline(
        multiplicarPor(2),
        filtrarMayoresQue(50),  // Ningún número cumplirá esta condición
        sumar
    );
    
    auto resultado3 = pipelineExigente(numeros);
    printResult(resultado3);
    
    // Encadenamiento de pipelines
    std::cout << "\nEjemplo 4 - Composición de pipelines:" << std::endl;
    auto etapa1 = createPipeline(multiplicarPor(2), imprimirVector);
    auto etapa2 = createPipeline(filtrarPares, imprimirVector);
    auto etapa3 = createPipeline(sumar);
    
    auto pipelineCompuesto = createPipeline(
        etapa1,
        etapa2,
        etapa3
    );
    
    auto resultado4 = pipelineCompuesto(numeros);
    printResult(resultado4);
    
    return 0;
}`,
      explanation: [
        { line: 13, text: "Definición de un tipo para representar errores en el pipeline." },
        { line: 18, text: "Tipo variante que puede contener un valor válido o un error, similar a Either en lenguajes funcionales." },
        { line: 21, text: "Funciones utilitarias para trabajar con el tipo Result." },
        { line: 39, text: "Operador pipe para resultados que incluye manejo de errores (estilo monádico)." },
        { line: 54, text: "Función para crear filtros con manejo automático de excepciones." },
        { line: 65, text: "Implementación de filtros reutilizables usando el patrón." },
        { line: 73, text: "Filtro parametrizado que acepta una condición y proporciona contexto para errores." },
        { line: 86, text: "Filtro para sumar con verificación de precondiciones." },
        { line: 91, text: "Filtro utilitario para visualizar los datos durante el procesamiento." },
        { line: 101, text: "Función para crear un pipeline resiliente que propaga errores adecuadamente." },
        { line: 114, text: "Función utilitaria para imprimir el resultado final de forma clara." },
        { line: 133, text: "Creación de un pipeline completo con varios pasos de procesamiento." },
        { line: 142, text: "Demostración de manejo de error con un vector vacío." },
        { line: 147, text: "Demostración de error cuando ningún elemento cumple un criterio de filtro." },
        { line: 158, text: "Composición de múltiples pipelines para crear un flujo más complejo." }
      ]
    },
    java: {
      code: `import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PipeFilterExample {
    
    // Interfaz para representar una función que puede fallar
    interface ThrowingFunction<T, R> {
        R apply(T t) throws Exception;
    }
    
    // Clase para representar un resultado o un error
    static class Result<T> {
        private final T value;
        private final String error;
        
        private Result(T value, String error) {
            this.value = value;
            this.error = error;
        }
        
        static <T> Result<T> success(T value) {
            return new Result<>(value, null);
        }
        
        static <T> Result<T> failure(String error) {
            return new Result<>(null, error);
        }
        
        boolean isSuccess() {
            return error == null;
        }
        
        T getValue() {
            if (!isSuccess()) {
                throw new IllegalStateException("Cannot get value from error result");
            }
            return value;
        }
        
        String getError() {
            return error;
        }
        
        <R> Result<R> map(ThrowingFunction<? super T, ? extends R> mapper) {
            if (!isSuccess()) {
                return failure(error);
            }
            
            try {
                return success(mapper.apply(value));
            } catch (Exception e) {
                return failure(e.getMessage());
            }
        }
        
        @Override
        public String toString() {
            return isSuccess() ? String.valueOf(value) : "Error: " + error;
        }
    }
    
    // Clase para construir y ejecutar pipelines
    static class Pipeline<T, R> {
        private final Function<T, Result<R>> pipeline;
        
        private Pipeline(Function<T, Result<R>> pipeline) {
            this.pipeline = pipeline;
        }
        
        // Método para crear un pipeline inicial
        static <T> Pipeline<T, T> start() {
            return new Pipeline<>(input -> Result.success(input));
        }
        
        // Método para añadir un paso al pipeline
        <V> Pipeline<T, V> pipe(ThrowingFunction<? super R, ? extends V> mapper) {
            return new Pipeline<>(input -> 
                pipeline.apply(input).map(mapper)
            );
        }
        
        // Método para ejecutar el pipeline completo
        Result<R> execute(T input) {
            return pipeline.apply(input);
        }
    }
    
    // Filtros reutilizables
    static ThrowingFunction<List<Integer>, List<Integer>> multiplyBy(int factor) {
        return numbers -> {
            if (numbers == null || numbers.isEmpty()) {
                throw new IllegalArgumentException("Lista vacía o nula");
            }
            return numbers.stream()
                          .map(n -> n * factor)
                          .collect(Collectors.toList());
        };
    }
    
    static ThrowingFunction<List<Integer>, List<Integer>> filterBy(Predicate<Integer> predicate, String description) {
        return numbers -> {
            if (numbers == null || numbers.isEmpty()) {
                throw new IllegalArgumentException("Lista vacía o nula");
            }
            
            List<Integer> result = numbers.stream()
                                         .filter(predicate)
                                         .collect(Collectors.toList());
                                         
            if (result.isEmpty()) {
                throw new IllegalStateException("No hay elementos que cumplan el criterio: " + description);
            }
            
            return result;
        };
    }
    
    static ThrowingFunction<List<Integer>, Integer> sum() {
        return numbers -> {
            if (numbers == null || numbers.isEmpty()) {
                throw new IllegalArgumentException("No se puede sumar una lista vacía");
            }
            return numbers.stream().mapToInt(Integer::intValue).sum();
        };
    }
    
    static <T> ThrowingFunction<T, T> log(String prefix) {
        return value -> {
            System.out.println(prefix + ": " + value);
            return value;
        };
    }
    
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        List<Integer> empty = Collections.emptyList();
        
        // Crear un pipeline reutilizable
        Pipeline<List<Integer>, Integer> processingPipeline = Pipeline.<List<Integer>>start()
            .pipe(log("Entrada"))
            .pipe(multiplyBy(2))
            .pipe(log("Después de multiplicar"))
            .pipe(filterBy(n -> n % 2 == 0, "números pares"))
            .pipe(log("Después de filtrar pares"))
            .pipe(sum());
        
        // Ejecutar el pipeline con datos válidos
        System.out.println("Ejemplo 1 - Pipeline con datos válidos:");
        Result<Integer> result1 = processingPipeline.execute(numbers);
        System.out.println("Resultado: " + result1);
        
        // Ejecutar con lista vacía
        System.out.println("\nEjemplo 2 - Pipeline con lista vacía:");
        Result<Integer> result2 = processingPipeline.execute(empty);
        System.out.println("Resultado: " + result2);
        
        // Pipeline con filtro que no tendrá coincidencias
        System.out.println("\nEjemplo 3 - Pipeline sin coincidencias en filtro:");
        Pipeline<List<Integer>, Integer> strictPipeline = Pipeline.<List<Integer>>start()
            .pipe(multiplyBy(3))
            .pipe(filterBy(n -> n > 100, "mayores que 100"))
            .pipe(sum());
            
        Result<Integer> result3 = strictPipeline.execute(numbers);
        System.out.println("Resultado: " + result3);
        
        // Composición de pipelines
        System.out.println("\nEjemplo 4 - Composición de pipelines:");
        
        // Pipeline para transformar strings a enteros
        Pipeline<String, List<Integer>> stringToNumbers = Pipeline.<String>start()
            .pipe(s -> Arrays.stream(s.split(","))
                           .map(String::trim)
                           .map(Integer::parseInt)
                           .collect(Collectors.toList()));
        
        // Pipeline para procesar los números
        Pipeline<List<Integer>, Double> numberProcessor = Pipeline.<List<Integer>>start()
            .pipe(multiplyBy(2))
            .pipe(list -> list.stream().mapToDouble(i -> i).average().orElseThrow());
        
        // Pipeline compuesto
        Pipeline<String, Double> composedPipeline = Pipeline.<String>start()
            .pipe(log("Entrada string"))
            .pipe(s -> stringToNumbers.execute(s).getValue())
            .pipe(log("Convertido a números"))
            .pipe(nums -> numberProcessor.execute(nums).getValue());
        
        Result<Double> result4 = composedPipeline.execute("1, 2, 3, 4, 5");
        System.out.println("Resultado de pipeline compuesto: " + result4);
    }
}`,
      explanation: [
        { line: 10, text: "Interfaz para representar una función que puede lanzar excepciones." },
        { line: 14, text: "Clase Result para manejar resultados exitosos o errores, similar a Either en lenguajes funcionales." },
        { line: 39, text: "Método map que permite encadenar operaciones de forma segura, propagando errores." },
        { line: 56, text: "Clase Pipeline que facilita la construcción y ejecución de pipelines." },
        { line: 65, text: "Método estático start para iniciar la construcción de un pipeline." },
        { line: 70, text: "Método pipe para añadir un paso de procesamiento al pipeline." },
        { line: 77, text: "Método execute para ejecutar el pipeline completo con una entrada." },
        { line: 83, text: "Implementación de filtros reutilizables para procesamiento de datos." },
        { line: 93, text: "Filtro parametrizado que acepta un predicado y descripción para mensajes de error." },
        { line: 111, text: "Filtro para sumar los elementos de una lista con validación." },
        { line: 120, text: "Filtro utilitario para logging intermedio de los datos." },
        { line: 131, text: "Construcción de un pipeline reutilizable con múltiples pasos." },
        { line: 140, text: "Ejecución del pipeline con datos válidos." },
        { line: 145, text: "Demostración de manejo de errores con una lista vacía." },
        { line: 150, text: "Pipeline con un filtro que no encontrará coincidencias." },
        { line: 165, text: "Implementación de composición avanzada de pipelines." }
      ]
    }
  },
  comparisons: [
    {
      title: 'Implementación Básica',
      cppTraditional: 'Sobrecarga del operador | para crear una sintaxis de pipeline intuitiva.',
      cppModern: 'Implementación avanzada con manejo de errores usando std::variant y monads.',
      java: 'Clase explícita Pipeline con métodos pipe() y execute() para construcción y ejecución.'
    },
    {
      title: 'Manejo de Errores',
      cppTraditional: 'Limitado, depende de las funciones individuales.',
      cppModern: 'Robusto con propagación automática de errores, similar a Result/Either en lenguajes funcionales.',
      java: 'Implementado con clase Result y propagación a través del pipeline.'
    },
    {
      title: 'Flexibilidad',
      cppTraditional: 'Buena para casos simples, puede volverse compleja para manejar errores o tipos heterogéneos.',
      cppModern: 'Alta, soporta composición, manejo de errores y tipos heterogéneos con std::variant.',
      java: 'Alta con un diseño explícito de clases, aunque más verbose que las soluciones de C++.'
    },
    {
      title: 'Sintaxis y Legibilidad',
      cppTraditional: 'Muy concisa y expresiva con el operador |.',
      cppModern: 'Concisa pero ligeramente más compleja debido al manejo de errores.',
      java: 'Más verbosa pero explícita y clara, especialmente para desarrolladores no familiarizados con programación funcional.'
    }
  ],
  notes: 'El patrón Pipe & Filter es fundamental en programación funcional para crear flujos de datos claros y mantenibles. Aunque originalmente proviene de sistemas operativos UNIX, ha encontrado amplia aplicación en el procesamiento de datos y transformaciones secuenciales. Lenguajes como F#, Elixir y Clojure ofrecen operadores de pipeline nativos (|>), mientras que JavaScript tiene una propuesta para incluir este operador. En C++, la sobrecarga del operador | proporciona una sintaxis elegante, mientras que en Java se requiere un enfoque más explícito. Al implementar este patrón, es importante considerar el manejo de errores, la composición de pipelines y la eficiencia. Para sistemas de producción, se recomienda implementar mecanismos para monitorizar el rendimiento de cada filtro y capturar métricas intermedias.'
};

export default pipeFilterPattern; 