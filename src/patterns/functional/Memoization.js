const memoizationPattern = {
  id: 'memoization',
  name: 'Memoization',
  category: 'functional',
  description: 'Técnica de optimización que almacena los resultados de llamadas a funciones costosas y devuelve el resultado en caché cuando se vuelven a solicitar los mismos inputs.',
  
  theory: {
    background: 'La memoización es una forma de optimización que proviene de la programación dinámica. El término fue acuñado por Donald Michie en 1968 y deriva de la palabra "memorándum" (información registrada para uso futuro).',
    problem: 'Las funciones costosas (en términos de CPU o I/O) que son llamadas repetidamente con los mismos argumentos desperdician recursos al recalcular resultados ya conocidos.',
    solution: 'Almacenar los resultados de las llamadas a funciones en una estructura de caché (típicamente un mapa), utilizando los argumentos como clave. Cuando la función se llama de nuevo con los mismos argumentos, devolver directamente el resultado almacenado en lugar de recalcularlo.',
    applicability: [
      'Funciones puras (sin efectos secundarios, que siempre devuelven el mismo resultado para los mismos inputs)',
      'Operaciones recursivas como cálculos de Fibonacci o factorial',
      'Funciones costosas con alta probabilidad de ser llamadas repetidamente con los mismos argumentos',
      'Procesamiento de datos con patrones repetitivos',
      'Cuando el ahorro de tiempo de ejecución es más importante que el uso de memoria adicional'
    ],
    consequences: [
      'Mejora significativa del rendimiento para operaciones repetitivas',
      'Aumento del uso de memoria proporcional al número de resultados almacenados',
      'Posible overhead en operaciones simples debido al coste de gestión de la caché',
      'Puede complicar la gestión de memoria y causar fugas si no se implementa una estrategia de expiración'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <map>
#include <string>
#include <functional>
#include <chrono>

// Función factorial sin memoización
long long factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}

// Función Fibonacci sin memoización
long long fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Clase para memoización genérica
template<typename R, typename... Args>
class Memoizer {
private:
    std::function<R(Args...)> func;
    std::map<std::tuple<Args...>, R> cache;
    
public:
    Memoizer(std::function<R(Args...)> f) : func(f) {}
    
    R operator()(Args... args) {
        // Crear una tupla con los argumentos como clave
        auto key = std::make_tuple(args...);
        
        // Buscar en la caché
        auto it = cache.find(key);
        if (it != cache.end()) {
            std::cout << "Cache hit! ";
            return it->second;
        }
        
        // Calcular y almacenar el resultado
        R result = func(args...);
        cache[key] = result;
        return result;
    }
    
    // Limpiar la caché
    void clearCache() {
        cache.clear();
    }
    
    // Obtener el tamaño de la caché
    size_t cacheSize() const {
        return cache.size();
    }
};

// Implementación específica para Fibonacci con memoización manual
long long fibonacci_memo(int n, std::map<int, long long>& memo) {
    // Verificar si ya tenemos el resultado
    auto it = memo.find(n);
    if (it != memo.end()) {
        return it->second;
    }
    
    // Calcular y almacenar el resultado
    long long result;
    if (n <= 1) {
        result = n;
    } else {
        result = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo);
    }
    
    memo[n] = result;
    return result;
}

// Función de ayuda para medir el tiempo de ejecución
template<typename Func, typename... Args>
void measureTime(const std::string& name, Func func, Args... args) {
    auto start = std::chrono::high_resolution_clock::now();
    auto result = func(args...);
    auto end = std::chrono::high_resolution_clock::now();
    
    std::chrono::duration<double, std::milli> duration = end - start;
    
    std::cout << name << " = " << result 
              << " (tiempo: " << duration.count() << " ms)" << std::endl;
}

int main() {
    std::cout << "--- Comparación de rendimiento con Fibonacci ---" << std::endl;
    
    // Fibonacci sin memoización
    std::cout << "Sin memoización:" << std::endl;
    for (int i = 30; i <= 35; ++i) {
        measureTime("fibonacci(" + std::to_string(i) + ")", fibonacci, i);
    }
    
    std::cout << "\\nCon memoización manual:" << std::endl;
    std::map<int, long long> memo;
    for (int i = 30; i <= 40; ++i) {
        measureTime("fibonacci_memo(" + std::to_string(i) + ")", fibonacci_memo, i, std::ref(memo));
    }
    
    std::cout << "\\nCon memoizador genérico:" << std::endl;
    
    // Crear una función recursiva memoizada para Fibonacci
    std::function<long long(int)> fib_lambda = [](int n) {
        if (n <= 1) return (long long)n;
        return fib_lambda(n - 1) + fib_lambda(n - 2);
    };
    
    Memoizer<long long, int> memoized_fib(fib_lambda);
    
    // Redefinir la función lambda para usar el memoizer
    fib_lambda = [&memoized_fib](int n) {
        return memoized_fib(n);
    };
    
    for (int i = 30; i <= 40; ++i) {
        measureTime("memoized_fib(" + std::to_string(i) + ")", fib_lambda, i);
    }
    
    std::cout << "\\nTamaño de caché: " << memoized_fib.cacheSize() << " entradas" << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 7, text: "Implementación recursiva estándar de la función factorial sin memoización." },
        { line: 13, text: "Implementación recursiva estándar de Fibonacci sin memoización (muy ineficiente para n grande)." },
        { line: 19, text: "Clase genérica Memoizer que puede envolver cualquier función y aplicar memoización." },
        { line: 22, text: "Uso de un map para almacenar resultados, con tuplas de argumentos como claves." },
        { line: 28, text: "Implementamos operator() para convertir la clase en un objeto invocable." },
        { line: 41, text: "Métodos adicionales para gestionar la caché, como limpieza y obtención del tamaño." },
        { line: 53, text: "Implementación manual de Fibonacci con memoización usando un mapa como caché." },
        { line: 73, text: "Función de ayuda para medir el tiempo de ejecución de otras funciones." },
        { line: 100, text: "Uso de función lambda recursiva con Memoizer para crear una versión eficiente de Fibonacci." },
        { line: 106, text: "Truco para hacer que la lambda use la versión memoizada de sí misma." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <unordered_map>
#include <functional>
#include <tuple>
#include <chrono>
#include <string>
#include <vector>
#include <thread>
#include <mutex>
#include <optional>

// Función hash para tuplas (C++17 o superior)
namespace std {
    template<typename... Args>
    struct hash<tuple<Args...>> {
        size_t operator()(const tuple<Args...>& t) const {
            return apply([](const Args&... args) {
                return (hash<Args>{}(args) + ...);
            }, t);
        }
    };
}

// Memoizador genérico con thread safety y expiración
template<typename R, typename... Args>
class Memoizer {
private:
    using KeyType = std::tuple<Args...>;
    using ResultType = std::optional<R>;
    
    struct CacheEntry {
        R result;
        std::chrono::steady_clock::time_point timestamp;
    };
    
    std::function<R(Args...)> func;
    std::unordered_map<KeyType, CacheEntry> cache;
    std::chrono::seconds ttl;
    mutable std::mutex mutex;
    
public:
    // Constructor con opción de tiempo de vida
    Memoizer(std::function<R(Args...)> f, std::chrono::seconds ttl = std::chrono::seconds::max())
        : func(std::move(f)), ttl(ttl) {}
    
    R operator()(Args... args) {
        auto key = std::make_tuple(args...);
        
        // Thread-safe access to cache
        {
            std::lock_guard<std::mutex> lock(mutex);
            auto now = std::chrono::steady_clock::now();
            
            // Check if entry exists and is not expired
            auto it = cache.find(key);
            if (it != cache.end()) {
                auto& entry = it->second;
                if (now - entry.timestamp < ttl) {
                    std::cout << "Cache hit! ";
                    return entry.result;
                } else {
                    // Entry expired, remove it
                    cache.erase(it);
                }
            }
        }
        
        // Calculate the result
        R result = func(args...);
        
        // Store in cache
        {
            std::lock_guard<std::mutex> lock(mutex);
            cache[key] = {result, std::chrono::steady_clock::now()};
        }
        
        return result;
    }
    
    // Clear the cache
    void clearCache() {
        std::lock_guard<std::mutex> lock(mutex);
        cache.clear();
    }
    
    // Get cache size
    size_t cacheSize() const {
        std::lock_guard<std::mutex> lock(mutex);
        return cache.size();
    }
    
    // Remove expired entries
    void clearExpired() {
        std::lock_guard<std::mutex> lock(mutex);
        auto now = std::chrono::steady_clock::now();
        
        for (auto it = cache.begin(); it != cache.end();) {
            if (now - it->second.timestamp >= ttl) {
                it = cache.erase(it);
            } else {
                ++it;
            }
        }
    }
};

// Fibonacci recursivo para demostración
uint64_t fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Función de prueba costosa
std::string heavyComputation(int id, int complexity) {
    // Simular trabajo pesado
    std::this_thread::sleep_for(std::chrono::milliseconds(complexity * 100));
    return "Result for ID " + std::to_string(id) + " with complexity " + std::to_string(complexity);
}

// Función de ayuda para medir el tiempo
template<typename Func, typename... Args>
auto measureTime(Func&& func, Args&&... args) {
    auto start = std::chrono::high_resolution_clock::now();
    auto result = std::forward<Func>(func)(std::forward<Args>(args)...);
    auto end = std::chrono::high_resolution_clock::now();
    
    std::chrono::duration<double, std::milli> duration = end - start;
    std::cout << "Tiempo: " << duration.count() << " ms" << std::endl;
    
    return result;
}

int main() {
    // 1. Memoización de Fibonacci
    std::cout << "=== Memoización de Fibonacci ===" << std::endl;
    
    // Crear memoizador de Fibonacci
    Memoizer<uint64_t, int> memoFib([](int n) {
        if (n <= 1) return static_cast<uint64_t>(n);
        return fibonacci(n - 1) + fibonacci(n - 2);
    });
    
    // Version con memoización recursiva (más eficiente)
    auto fibMemoRecursive = [&](int n) -> uint64_t {
        return memoFib(n);
    };
    
    // Comparar rendimiento
    std::cout << "Fibonacci(40) sin memoización: ";
    measureTime(fibonacci, 40);
    
    std::cout << "Fibonacci(40) con memoización: ";
    auto result = measureTime(fibMemoRecursive, 40);
    std::cout << "Resultado: " << result << std::endl;
    
    // 2. Memoización con expiración
    std::cout << "\\n=== Memoización con expiración ===" << std::endl;
    
    // Crear memoizador con TTL de 2 segundos
    Memoizer<std::string, int, int> memoHeavy(heavyComputation, std::chrono::seconds(2));
    
    std::cout << "Primera llamada (cache miss): ";
    measureTime([&]() { return memoHeavy(1, 2); });
    
    std::cout << "Segunda llamada (cache hit): ";
    measureTime([&]() { return memoHeavy(1, 2); });
    
    std::cout << "Esperando a que la entrada expire..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    
    std::cout << "Tercera llamada (cache miss después de expiración): ";
    measureTime([&]() { return memoHeavy(1, 2); });
    
    // 3. Memoización en ambiente multihilo
    std::cout << "\\n=== Memoización multihilo ===" << std::endl;
    
    // Crear memoizador thread-safe
    Memoizer<std::string, int, int> memoThreadSafe(heavyComputation);
    
    auto threadFunc = [&](int id) {
        std::cout << "Thread " << id << " - Primera llamada: ";
        measureTime([&]() { return memoThreadSafe(5, 1); }); // Todos los hilos calculan el mismo valor
        
        std::cout << "Thread " << id << " - Segunda llamada: ";
        measureTime([&]() { return memoThreadSafe(5, 1); });
    };
    
    std::vector<std::thread> threads;
    for (int i = 0; i < 3; ++i) {
        threads.push_back(std::thread(threadFunc, i));
    }
    
    for (auto& t : threads) {
        t.join();
    }
    
    std::cout << "Tamaño final de caché: " << memoThreadSafe.cacheSize() << " entradas" << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 12, text: "Implementación de función hash para tuplas, permitiendo usar std::unordered_map como caché." },
        { line: 24, text: "Clase Memoizer mejorada con thread safety y soporte para expiración de caché." },
        { line: 27, text: "Estructura CacheEntry que almacena el resultado y su timestamp para control de expiración." },
        { line: 33, text: "Uso de mutex para garantizar thread safety en operaciones de caché." },
        { line: 37, text: "Constructor que permite especificar tiempo de vida (TTL) para las entradas de caché." },
        { line: 41, text: "Implementación thread-safe de operator() con verificación de expiración." },
        { line: 74, text: "Método clearExpired para eliminar entradas expiradas de la caché." },
        { line: 99, text: "Función de prueba que simula un trabajo pesado para demostrar el beneficio de la memoización." },
        { line: 139, text: "Ejemplo de función lambda que utiliza memoización para optimizar cálculos recursivos." },
        { line: 177, text: "Demostración de memoización en ambiente multihilo, mostrando thread safety." }
      ]
    },
    java: {
      code: `import java.util.*;
import java.util.concurrent.*;
import java.util.function.Function;

public class MemoizationDemo {
    
    // Interfaz funcional para computaciones costosas
    @FunctionalInterface
    interface ExpensiveFunction<T, R> {
        R compute(T input);
    }
    
    // Memoizador simple
    static class Memoizer<T, R> {
        private final Map<T, R> cache = new ConcurrentHashMap<>();
        private final ExpensiveFunction<T, R> function;
        
        public Memoizer(ExpensiveFunction<T, R> function) {
            this.function = function;
        }
        
        public R compute(T input) {
            return cache.computeIfAbsent(input, function::compute);
        }
        
        public int cacheSize() {
            return cache.size();
        }
        
        public void clearCache() {
            cache.clear();
        }
    }
    
    // Memoizador avanzado con expiración
    static class MemoizerWithExpiry<T, R> {
        private final ConcurrentMap<T, CacheEntry<R>> cache = new ConcurrentHashMap<>();
        private final ExpensiveFunction<T, R> function;
        private final long expiryTimeMillis;
        
        private static class CacheEntry<R> {
            private final R value;
            private final long timestamp;
            
            CacheEntry(R value) {
                this.value = value;
                this.timestamp = System.currentTimeMillis();
            }
            
            boolean isExpired(long expiryTimeMillis) {
                return System.currentTimeMillis() - timestamp > expiryTimeMillis;
            }
        }
        
        public MemoizerWithExpiry(ExpensiveFunction<T, R> function, long expiryTimeMillis) {
            this.function = function;
            this.expiryTimeMillis = expiryTimeMillis;
        }
        
        public R compute(T input) {
            // Check if we have a valid cached value
            CacheEntry<R> entry = cache.get(input);
            if (entry != null && !entry.isExpired(expiryTimeMillis)) {
                System.out.println("Cache hit!");
                return entry.value;
            }
            
            // If no valid entry exists, compute and store
            R result = function.compute(input);
            cache.put(input, new CacheEntry<>(result));
            return result;
        }
        
        public int cacheSize() {
            return cache.size();
        }
        
        public void clearExpired() {
            cache.entrySet().removeIf(entry -> entry.getValue().isExpired(expiryTimeMillis));
        }
    }
    
    // Funciones para demostración
    
    // Fibonacci recursivo (ineficiente)
    public static long fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    // Simulación de operación costosa
    public static String expensiveOperation(String input) {
        try {
            // Simular trabajo pesado
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "Result for: " + input;
    }
    
    // Medir tiempo de ejecución
    public static <T, R> R measureTime(Function<T, R> function, T input, String message) {
        long startTime = System.currentTimeMillis();
        R result = function.apply(input);
        long endTime = System.currentTimeMillis();
        
        System.out.printf("%s - Tiempo: %d ms%n", message, (endTime - startTime));
        return result;
    }
    
    public static void main(String[] args) throws InterruptedException {
        // Ejemplo 1: Memoización simple de Fibonacci
        System.out.println("=== Memoización de Fibonacci ===");
        
        // Crear memoizador
        Memoizer<Integer, Long> fibMemoizer = new Memoizer<>(MemoizationDemo::fibonacci);
        
        // Uso con lambda recursiva para maximizar eficiencia
        ExpensiveFunction<Integer, Long> memoFib = new ExpensiveFunction<Integer, Long>() {
            @Override
            public Long compute(Integer n) {
                if (n <= 1) return (long) n;
                return fibMemoizer.compute(n - 1) + fibMemoizer.compute(n - 2);
            }
        };
        
        // Reemplazar la función original
        fibMemoizer = new Memoizer<>(memoFib);
        
        System.out.println("Fibonacci sin memoización:");
        measureTime(MemoizationDemo::fibonacci, 35, "fibonacci(35)");
        
        System.out.println("\\nFibonacci con memoización:");
        long result = measureTime(fibMemoizer::compute, 35, "fibonacci(35)");
        System.out.println("Resultado: " + result);
        System.out.println("Tamaño de caché: " + fibMemoizer.cacheSize());
        
        // Ejemplo 2: Memoización con expiración
        System.out.println("\\n=== Memoización con expiración ===");
        
        MemoizerWithExpiry<String, String> expirableMemoizer = 
            new MemoizerWithExpiry<>(MemoizationDemo::expensiveOperation, 2000); // 2 segundos TTL
        
        System.out.println("Primera llamada (cache miss):");
        measureTime(expirableMemoizer::compute, "test", "expensiveOperation(test)");
        
        System.out.println("\\nSegunda llamada (cache hit):");
        measureTime(expirableMemoizer::compute, "test", "expensiveOperation(test)");
        
        System.out.println("\\nEsperando a que la caché expire...");
        Thread.sleep(2500); // Esperar más que el TTL
        
        System.out.println("\\nTercera llamada (cache miss después de expiración):");
        measureTime(expirableMemoizer::compute, "test", "expensiveOperation(test)");
        
        // Ejemplo 3: Memoización en entorno multihilo
        System.out.println("\\n=== Memoización multihilo ===");
        
        ExecutorService executor = Executors.newFixedThreadPool(3);
        CountDownLatch latch = new CountDownLatch(3);
        
        MemoizerWithExpiry<String, String> threadSafeMemoizer = 
            new MemoizerWithExpiry<>(MemoizationDemo::expensiveOperation, 10000);
        
        for (int i = 0; i < 3; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    System.out.println("Thread " + threadId + " - Primera llamada:");
                    measureTime(threadSafeMemoizer::compute, "shared", 
                                "Thread " + threadId + " - expensiveOperation");
                    
                    System.out.println("Thread " + threadId + " - Segunda llamada:");
                    measureTime(threadSafeMemoizer::compute, "shared", 
                                "Thread " + threadId + " - expensiveOperation");
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await();
        executor.shutdown();
        
        System.out.println("\\nTamaño final de caché: " + threadSafeMemoizer.cacheSize());
    }
}`,
      explanation: [
        { line: 6, text: "Definimos una interfaz funcional para representar computaciones costosas que serán memoizadas." },
        { line: 12, text: "Clase Memoizer básica que implementa la memoización para funciones de un solo argumento." },
        { line: 21, text: "Uso de Map.computeIfAbsent() que proporciona atomicidad para verificar y actualizar en un solo paso." },
        { line: 33, text: "Memoizador avanzado con soporte para expiración de entradas de caché." },
        { line: 37, text: "Clase interna CacheEntry que almacena el valor y su timestamp para controlar expiración." },
        { line: 57, text: "Método compute() que verifica si hay una entrada válida (no expirada) antes de devolverla." },
        { line: 75, text: "Implementación ineficiente de Fibonacci para demostrar los beneficios de la memoización." },
        { line: 109, text: "Uso de clases anónimas para crear una versión eficiente de Fibonacci con memoización." },
        { line: 141, text: "Ejemplo de memoización con expiración que muestra el comportamiento con cache hits y misses." },
        { line: 159, text: "Demostración de uso en entorno multihilo, mostrando que la implementación es thread-safe." }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de caché',
      cppTraditional: 'Implementación básica con std::map, sin expiración automática ni políticas de evicción.',
      cppModern: 'Usa unordered_map con timestamps para expiración, thread safety con mutex y soporte para TTL configurable.',
      java: 'Utiliza ConcurrentHashMap para thread safety y sistema de entradas con control de expiración.'
    },
    {
      title: 'Eficiencia de acceso',
      cppTraditional: 'std::map tiene complejidad O(log n) para búsquedas, menos eficiente para grandes cachés.',
      cppModern: 'std::unordered_map ofrece acceso O(1) promedio, mejorando rendimiento para grandes cachés.',
      java: 'ConcurrentHashMap proporciona acceso O(1) con optimizaciones para concurrencia.'
    },
    {
      title: 'Thread safety',
      cppTraditional: 'No es thread-safe, requiere implementación manual de protección.',
      cppModern: 'Implementa thread safety mediante std::mutex para acceso exclusivo a la caché.',
      java: 'Inherentemente thread-safe gracias a ConcurrentHashMap y operaciones atómicas.'
    },
    {
      title: 'Aplicabilidad',
      cppTraditional: 'Mejor para aplicaciones de un solo hilo o donde el rendimiento es crítico.',
      cppModern: 'Adecuado para sistemas concurrentes con necesidad de control de memoria y expiración.',
      java: 'Ideal para sistemas empresariales con alto volumen de transacciones y entornos concurrentes.'
    }
  ],
  
  notes: 'La memoización es una técnica poderosa para optimizar operaciones costosas repetitivas, pero debe usarse juiciosamente. Para funciones que rara vez se llaman con los mismos argumentos o cuyo tiempo de ejecución es bajo, la sobrecarga de la caché puede superar los beneficios. Considere implementar políticas de evicción (LRU, LFU) para limitar el crecimiento de la caché en aplicaciones de larga duración. En lenguajes funcionales como Haskell o Clojure, la memoización es a menudo una característica incorporada o fácilmente disponible a través de bibliotecas estándar. El patrón es particularmente útil en procesamiento recursivo, consultas a bases de datos, cálculos matemáticos complejos y operaciones de I/O.'
};

export default memoizationPattern; 