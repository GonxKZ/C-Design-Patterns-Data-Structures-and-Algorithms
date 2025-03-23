const producerConsumerPattern = {
  id: 'producer-consumer',
  name: 'Producer-Consumer',
  category: 'concurrency',
  description: 'Separa la producción y el consumo de datos en diferentes hilos o procesos, utilizando un buffer compartido y sincronizado para la comunicación entre ellos.',
  
  theory: {
    background: 'El patrón Producer-Consumer es un clásico en la programación concurrente y sistemas operativos. Es fundamental para entender la sincronización entre hilos y el manejo de recursos compartidos.',
    problem: 'Cuando un sistema tiene componentes que generan datos (productores) y otros que procesan esos datos (consumidores), puede ocurrir que los productores generen datos más rápido de lo que los consumidores pueden procesarlos, o viceversa. Esto puede llevar a pérdida de datos o ineficiencias.',
    solution: 'Implementar un buffer compartido y sincronizado entre productores y consumidores. Los productores colocan datos en el buffer cuando hay espacio disponible, mientras que los consumidores extraen datos cuando hay elementos para procesar. Se utiliza la sincronización para evitar condiciones de carrera.',
    applicability: [
      'Sistemas de procesamiento de eventos donde los eventos se generan a una velocidad diferente a la que se procesan',
      'Aplicaciones de streaming y procesamiento de datos en tiempo real',
      'Sistemas donde es necesario desacoplar la generación de datos del procesamiento',
      'Escenarios de balanceo de carga donde se busca nivelar picos de trabajo'
    ],
    consequences: [
      'Desacopla la producción del consumo, permitiendo velocidades de procesamiento diferentes',
      'Mejora la utilización de recursos al permitir procesamiento asíncrono',
      'Introduce complejidad por la necesidad de sincronización',
      'Puede sufrir problemas de rendimiento si el buffer no está correctamente dimensionado'
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <chrono>
#include <random>

// Buffer compartido con sincronización
template<typename T>
class SharedBuffer {
private:
    std::queue<T> buffer;
    size_t capacity;
    
    std::mutex mutex;
    std::condition_variable not_full;
    std::condition_variable not_empty;
    bool shutdown;

public:
    SharedBuffer(size_t capacity) : capacity(capacity), shutdown(false) {}
    
    // Productor: inserta un elemento en el buffer
    void produce(const T& item) {
        std::unique_lock<std::mutex> lock(mutex);
        
        // Esperar mientras el buffer esté lleno
        not_full.wait(lock, [this]() {
            return buffer.size() < capacity || shutdown;
        });
        
        if (shutdown) return;
        
        // Insertar elemento
        buffer.push(item);
        std::cout << "Producido: " << item << ". Buffer: " << buffer.size() << "/" << capacity << std::endl;
        
        // Notificar a los consumidores
        not_empty.notify_one();
    }
    
    // Consumidor: retira un elemento del buffer
    bool consume(T& item) {
        std::unique_lock<std::mutex> lock(mutex);
        
        // Esperar mientras el buffer esté vacío
        not_empty.wait(lock, [this]() {
            return !buffer.empty() || shutdown;
        });
        
        if (buffer.empty() && shutdown) return false;
        
        // Retirar elemento
        item = buffer.front();
        buffer.pop();
        std::cout << "Consumido: " << item << ". Buffer: " << buffer.size() << "/" << capacity << std::endl;
        
        // Notificar a los productores
        not_full.notify_one();
        
        return true;
    }
    
    // Señalizar cierre para terminar los hilos
    void stop() {
        std::unique_lock<std::mutex> lock(mutex);
        shutdown = true;
        not_empty.notify_all();
        not_full.notify_all();
    }
    
    // Verificar si el buffer está vacío
    bool empty() const {
        std::unique_lock<std::mutex> lock(mutex);
        return buffer.empty();
    }
};

// Funciones para los hilos productor y consumidor
void producer_function(SharedBuffer<int>& buffer, int id, int items_to_produce) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> delay(100, 500);
    
    for (int i = 0; i < items_to_produce; ++i) {
        // Simular trabajo con una espera aleatoria
        std::this_thread::sleep_for(std::chrono::milliseconds(delay(gen)));
        
        // Producir un elemento
        int item = id * 1000 + i;
        buffer.produce(item);
    }
    
    std::cout << "Productor " << id << " ha finalizado." << std::endl;
}

void consumer_function(SharedBuffer<int>& buffer, int id) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> delay(200, 800);
    
    int item;
    while (buffer.consume(item)) {
        // Simular procesamiento con una espera aleatoria
        std::this_thread::sleep_for(std::chrono::milliseconds(delay(gen)));
        
        std::cout << "Consumidor " << id << " procesó: " << item << std::endl;
    }
    
    std::cout << "Consumidor " << id << " ha finalizado." << std::endl;
}

// Demostración del patrón
int main() {
    // Crear buffer compartido
    SharedBuffer<int> buffer(10); // Capacidad de 10 elementos
    
    // Crear múltiples productores y consumidores
    const int num_producers = 3;
    const int num_consumers = 2;
    const int items_per_producer = 5;
    
    std::vector<std::thread> producers;
    std::vector<std::thread> consumers;
    
    // Iniciar consumidores
    for (int i = 0; i < num_consumers; ++i) {
        consumers.emplace_back(consumer_function, std::ref(buffer), i + 1);
    }
    
    // Iniciar productores
    for (int i = 0; i < num_producers; ++i) {
        producers.emplace_back(producer_function, std::ref(buffer), i + 1, items_per_producer);
    }
    
    // Esperar a que los productores finalicen
    for (auto& producer : producers) {
        producer.join();
    }
    
    // Esperar un poco para procesar los elementos restantes
    std::this_thread::sleep_for(std::chrono::seconds(1));
    
    // Señalizar finalización a los consumidores
    buffer.stop();
    
    // Esperar a que los consumidores finalicen
    for (auto& consumer : consumers) {
        consumer.join();
    }
    
    std::cout << "Programa finalizado correctamente." << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 9, text: "Clase SharedBuffer que implementa un buffer compartido y sincronizado." },
        { line: 15, text: "Variables de sincronización: mutex para exclusión mutua y condition_variables para señalización." },
        { line: 23, text: "Método produce(): permite a los productores insertar elementos en el buffer cuando hay espacio." },
        { line: 26, text: "Espera mientras el buffer esté lleno, usando un lambda para la condición de espera." },
        { line: 40, text: "Método consume(): permite a los consumidores retirar elementos del buffer cuando hay disponibles." },
        { line: 43, text: "Espera mientras el buffer esté vacío, usando un lambda para la condición de espera." },
        { line: 64, text: "Método stop(): señaliza la finalización a todos los hilos esperando en condition variables." },
        { line: 74, text: "Función para los hilos productores que generan elementos con un retardo aleatorio." },
        { line: 90, text: "Función para los hilos consumidores que procesan elementos con un retardo aleatorio." },
        { line: 108, text: "Función main que demuestra el uso del patrón con múltiples productores y consumidores." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <chrono>
#include <random>
#include <atomic>
#include <functional>
#include <future>

// Buffer compartido con sincronización usando C++ moderno
template<typename T>
class SharedBuffer {
private:
    std::queue<T> buffer;
    const size_t capacity;
    
    mutable std::mutex mutex;
    std::condition_variable not_full;
    std::condition_variable not_empty;
    std::atomic<bool> shutdown{false};

public:
    explicit SharedBuffer(size_t capacity) : capacity(capacity) {}
    
    // Productor: inserta un elemento en el buffer
    void produce(T item) {
        std::unique_lock<std::mutex> lock(mutex);
        
        // Esperar mientras el buffer esté lleno
        not_full.wait(lock, [this]() {
            return buffer.size() < capacity || shutdown.load();
        });
        
        if (shutdown.load()) return;
        
        // Insertar elemento usando move semantics
        buffer.push(std::move(item));
        std::cout << "Producido: " << buffer.back() << ". Buffer: " << buffer.size() << "/" << capacity << std::endl;
        
        // Notificar a los consumidores
        not_empty.notify_one();
    }
    
    // Consumidor: retira un elemento del buffer
    std::optional<T> consume() {
        std::unique_lock<std::mutex> lock(mutex);
        
        // Esperar mientras el buffer esté vacío
        not_empty.wait(lock, [this]() {
            return !buffer.empty() || shutdown.load();
        });
        
        if (buffer.empty()) return std::nullopt;
        
        // Retirar elemento usando move semantics
        T item = std::move(buffer.front());
        buffer.pop();
        std::cout << "Consumido: " << item << ". Buffer: " << buffer.size() << "/" << capacity << std::endl;
        
        // Notificar a los productores
        not_full.notify_one();
        
        return item;
    }
    
    // Señalizar cierre para terminar los hilos
    void stop() {
        shutdown.store(true);
        not_empty.notify_all();
        not_full.notify_all();
    }
    
    // Verificar si el buffer está vacío
    bool empty() const {
        std::lock_guard<std::mutex> lock(mutex);
        return buffer.empty();
    }
};

// Clase productor que genera elementos
class Producer {
private:
    SharedBuffer<int>& buffer;
    int id;
    int items_to_produce;

public:
    Producer(SharedBuffer<int>& buffer, int id, int items_to_produce)
        : buffer(buffer), id(id), items_to_produce(items_to_produce) {}
    
    // Operador función para usar con std::async
    void operator()() {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> delay(100, 500);
        
        for (int i = 0; i < items_to_produce; ++i) {
            // Simular trabajo con una espera aleatoria
            std::this_thread::sleep_for(std::chrono::milliseconds(delay(gen)));
            
            // Producir un elemento
            int item = id * 1000 + i;
            buffer.produce(item);
        }
        
        std::cout << "Productor " << id << " ha finalizado." << std::endl;
    }
};

// Clase consumidor que procesa elementos
class Consumer {
private:
    SharedBuffer<int>& buffer;
    int id;

public:
    Consumer(SharedBuffer<int>& buffer, int id)
        : buffer(buffer), id(id) {}
    
    // Operador función para usar con std::async
    void operator()() {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> delay(200, 800);
        
        while (true) {
            auto item_opt = buffer.consume();
            if (!item_opt) break;
            
            // Simular procesamiento con una espera aleatoria
            std::this_thread::sleep_for(std::chrono::milliseconds(delay(gen)));
            
            std::cout << "Consumidor " << id << " procesó: " << *item_opt << std::endl;
        }
        
        std::cout << "Consumidor " << id << " ha finalizado." << std::endl;
    }
};

// Demostración del patrón
int main() {
    // Crear buffer compartido
    SharedBuffer<int> buffer(10); // Capacidad de 10 elementos
    
    // Crear múltiples productores y consumidores
    const int num_producers = 3;
    const int num_consumers = 2;
    const int items_per_producer = 5;
    
    std::vector<std::future<void>> producer_futures;
    std::vector<std::future<void>> consumer_futures;
    
    // Iniciar consumidores usando std::async
    for (int i = 0; i < num_consumers; ++i) {
        Consumer consumer(buffer, i + 1);
        consumer_futures.push_back(std::async(std::launch::async, std::move(consumer)));
    }
    
    // Iniciar productores usando std::async
    for (int i = 0; i < num_producers; ++i) {
        Producer producer(buffer, i + 1, items_per_producer);
        producer_futures.push_back(std::async(std::launch::async, std::move(producer)));
    }
    
    // Esperar a que los productores finalicen
    for (auto& future : producer_futures) {
        future.wait();
    }
    
    // Esperar un poco para procesar los elementos restantes
    std::this_thread::sleep_for(std::chrono::seconds(1));
    
    // Señalizar finalización a los consumidores
    buffer.stop();
    
    // Esperar a que los consumidores finalicen
    for (auto& future : consumer_futures) {
        future.wait();
    }
    
    std::cout << "Programa finalizado correctamente." << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 14, text: "SharedBuffer implementado con características modernas como std::atomic para shutdown." },
        { line: 21, text: "Constructor con 'explicit' para evitar conversiones implícitas, siguiendo buenas prácticas." },
        { line: 24, text: "Método produce() ahora toma el ítem por valor para usar move semantics." },
        { line: 43, text: "Método consume() ahora retorna std::optional<T> para manejar el caso vacío de forma segura." },
        { line: 81, text: "Clase Producer que encapsula la lógica de producción de elementos." },
        { line: 90, text: "Implementamos operator() para usar la clase con std::async y std::bind." },
        { line: 111, text: "Clase Consumer que encapsula la lógica de consumo de elementos." },
        { line: 120, text: "Uso de std::optional para manejar elegantemente el caso de finalización." },
        { line: 143, text: "Usamos std::future<void> para manejar los resultados de las tareas asíncronas." },
        { line: 148, text: "Lanzamos los consumidores y productores con std::async en lugar de crear threads manualmente." }
      ]
    },
    java: {
      code: `import java.util.Random;
import java.util.concurrent.*;
import java.util.function.Consumer;

public class ProducerConsumerDemo {
    
    // Buffer compartido con sincronización
    static class SharedBuffer<T> {
        private final BlockingQueue<T> buffer;
        private volatile boolean shutdown = false;
        
        public SharedBuffer(int capacity) {
            // Usamos una LinkedBlockingQueue con capacidad limitada
            this.buffer = new LinkedBlockingQueue<>(capacity);
        }
        
        // Método para productores
        public void produce(T item) throws InterruptedException {
            if (shutdown) return;
            buffer.put(item); // Bloquea si el buffer está lleno
            System.out.println("Producido: " + item + ". Buffer: " + buffer.size() + "/" + buffer.remainingCapacity());
        }
        
        // Método para consumidores
        public T consume() throws InterruptedException {
            T item = buffer.poll(100, TimeUnit.MILLISECONDS); // Espera 100ms como máximo
            if (item != null) {
                System.out.println("Consumido: " + item + ". Buffer: " + buffer.size() + "/" + buffer.remainingCapacity());
            }
            return item;
        }
        
        // Señalizar cierre
        public void shutdown() {
            shutdown = true;
        }
        
        public boolean isShutdown() {
            return shutdown;
        }
    }
    
    // Clase productora
    static class Producer implements Runnable {
        private final SharedBuffer<Integer> buffer;
        private final int id;
        private final int itemsToProduce;
        private final Random random = new Random();
        
        public Producer(SharedBuffer<Integer> buffer, int id, int itemsToProduce) {
            this.buffer = buffer;
            this.id = id;
            this.itemsToProduce = itemsToProduce;
        }
        
        @Override
        public void run() {
            try {
                for (int i = 0; i < itemsToProduce; i++) {
                    // Simular trabajo
                    Thread.sleep(random.nextInt(400) + 100);
                    
                    // Producir un elemento
                    int item = id * 1000 + i;
                    buffer.produce(item);
                }
                System.out.println("Productor " + id + " ha finalizado.");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Productor " + id + " interrumpido.");
            }
        }
    }
    
    // Clase consumidora
    static class Consumer implements Runnable {
        private final SharedBuffer<Integer> buffer;
        private final int id;
        private final Random random = new Random();
        
        public Consumer(SharedBuffer<Integer> buffer, int id) {
            this.buffer = buffer;
            this.id = id;
        }
        
        @Override
        public void run() {
            try {
                while (!buffer.isShutdown() || buffer.consume() != null) {
                    // Intentar consumir un elemento
                    Integer item = buffer.consume();
                    
                    if (item != null) {
                        // Simular procesamiento
                        Thread.sleep(random.nextInt(600) + 200);
                        System.out.println("Consumidor " + id + " procesó: " + item);
                    }
                }
                System.out.println("Consumidor " + id + " ha finalizado.");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Consumidor " + id + " interrumpido.");
            }
        }
    }
    
    // Demostración usando ExecutorService
    public static void main(String[] args) throws InterruptedException {
        // Crear buffer compartido
        SharedBuffer<Integer> buffer = new SharedBuffer<>(10);
        
        // Parámetros
        final int numProducers = 3;
        final int numConsumers = 2;
        final int itemsPerProducer = 5;
        
        // Crear pool de threads
        ExecutorService executor = Executors.newFixedThreadPool(numProducers + numConsumers);
        
        // Iniciar consumidores
        for (int i = 0; i < numConsumers; i++) {
            executor.submit(new Consumer(buffer, i + 1));
        }
        
        // Iniciar productores
        for (int i = 0; i < numProducers; i++) {
            executor.submit(new Producer(buffer, i + 1, itemsPerProducer));
        }
        
        // Esperar a que los productores terminen (simplificación)
        Thread.sleep(5000);
        
        // Señalizar finalización
        buffer.shutdown();
        
        // Terminar el pool de threads
        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);
        
        System.out.println("Programa finalizado correctamente.");
    }
}`,
      explanation: [
        { line: 7, text: "Clase SharedBuffer que usa java.util.concurrent.BlockingQueue para la sincronización." },
        { line: 12, text: "Utilizamos LinkedBlockingQueue con capacidad limitada, que implementa las operaciones de bloqueo." },
        { line: 16, text: "Método produce() usa BlockingQueue.put() que bloquea si el buffer está lleno." },
        { line: 22, text: "Método consume() usa BlockingQueue.poll() con timeout para evitar bloqueo indefinido." },
        { line: 36, text: "Clase Producer que implementa Runnable para ejecutarse en un thread." },
        { line: 49, text: "El método run() genera elementos con un retardo aleatorio y los añade al buffer." },
        { line: 65, text: "Clase Consumer que implementa Runnable para consumir elementos del buffer." },
        { line: 78, text: "Loop principal que continúa hasta que el buffer esté vacío y se haya señalizado el cierre." },
        { line: 96, text: "Método main que usa ExecutorService para gestionar el pool de threads." },
        { line: 108, text: "Uso de executor.submit() para enviar las tareas al pool de threads." }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Mecanismo de sincronización',
      cppTraditional: 'Usa mutex y condition_variables para sincronización entre hilos.',
      cppModern: 'Utiliza condition_variables con std::atomic para la bandera de finalización, mejorando la eficiencia.',
      java: 'Usa BlockingQueue que encapsula internamente toda la sincronización necesaria.'
    },
    {
      title: 'Manejo de hilos',
      cppTraditional: 'Gestión manual de hilos usando std::thread y join().',
      cppModern: 'Utiliza std::async y std::future para abstraer la gestión de hilos y facilitar la obtención de resultados.',
      java: 'Usa ExecutorService que proporciona un pool de hilos gestionado y reutilizable.'
    },
    {
      title: 'Manejo de errores',
      cppTraditional: 'Depende de la implementación manual, generalmente a través de excepciones.',
      cppModern: 'Uso de std::optional para representar ausencia de valores en situaciones no excepcionales.',
      java: 'Manejo integrado de InterruptedException y uso de timeouts para evitar bloqueos indefinidos.'
    },
    {
      title: 'Rendimiento',
      cppTraditional: 'Bueno, pero requiere cuidado con las condiciones de carrera y deadlocks.',
      cppModern: 'Mejorado con move semantics y construcciones tipo std::atomic.',
      java: 'El recolector de basura puede introducir pausas, pero BlockingQueue está altamente optimizado.'
    }
  ],
  
  notes: 'El patrón Producer-Consumer es fundamental en la programación concurrente y se utiliza en muchos sistemas que requieren procesamiento asíncrono. En Java, BlockingQueue proporciona una implementación robusta y fácil de usar, mientras que en C++ se requiere más código para lograr el mismo comportamiento. Este patrón debe dimensionarse correctamente: un buffer demasiado pequeño puede limitar el rendimiento, mientras que uno demasiado grande puede consumir demasiada memoria. Las implementaciones modernas a menudo incluyen mecanismos para escalar dinámicamente el número de consumidores basándose en la carga del sistema.'
};

export default producerConsumerPattern; 