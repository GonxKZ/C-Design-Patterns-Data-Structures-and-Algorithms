const threadPoolPattern = {
  id: 'thread-pool',
  name: 'Thread Pool',
  category: 'concurrency',
  description: 'Mantiene un grupo de hilos de trabajo para ejecutar tareas, reduciendo la sobrecarga de creación y destrucción de hilos y mejorando el rendimiento de aplicaciones con muchas tareas de corta duración.',
  
  theory: {
    background: 'El patrón Thread Pool surgió como solución al alto costo de crear y destruir hilos, especialmente en sistemas con alta frecuencia de tareas pequeñas. Es fundamental en servidores web, bases de datos y aplicaciones de alto rendimiento.',
    problem: 'La creación y destrucción frecuente de hilos genera una sobrecarga significativa, afectando el rendimiento y causando una alta contención de recursos en sistemas con muchas tareas concurrentes de corta duración.',
    solution: 'Pre-crear un conjunto de hilos de trabajo que permanecen a la espera de tareas, eliminando el costo de inicialización repetitiva. Las tareas entrantes se encolan y son procesadas por los hilos disponibles.',
    applicability: [
      "Aplicaciones con muchas tareas concurrentes de corta duración",
      "Servidores que manejan múltiples solicitudes concurrentes",
      "Sistemas que necesitan limitar el número máximo de hilos para evitar agotamiento de recursos",
      "Aplicaciones que requieren un rendimiento predecible bajo carga variable"
    ],
    consequences: [
      "Mejor rendimiento para tareas cortas al eliminar la sobrecarga de creación de hilos",
      "Limitación controlada del paralelismo para evitar agotamiento de recursos",
      "Potencial para reutilizar hilos en múltiples operaciones",
      "Posibilidad de bloqueo si todas las tareas largas ocupan todos los hilos disponibles",
      "Complejidad adicional en la gestión del ciclo de vida de los hilos"
    ]
  },
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <atomic>

class ThreadPool {
private:
    // Vector de hilos de trabajo
    std::vector<std::thread> workers;
    
    // Cola de tareas
    std::queue<std::function<void()>> tasks;
    
    // Sincronización
    std::mutex queue_mutex;
    std::condition_variable condition;
    
    // Banderas de control
    bool stop;
    
public:
    // Constructor - inicia los hilos de trabajo
    ThreadPool(size_t numThreads) : stop(false) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    
                    {
                        // Bloqueo para acceder a la cola de tareas
                        std::unique_lock<std::mutex> lock(this->queue_mutex);
                        
                        // Esperar hasta que haya una tarea o se detenga el pool
                        this->condition.wait(lock, [this] {
                            return this->stop || !this->tasks.empty();
                        });
                        
                        // Si se detiene el pool y no hay tareas, terminar este hilo
                        if (this->stop && this->tasks.empty()) {
                            return;
                        }
                        
                        // Obtener la siguiente tarea
                        task = std::move(this->tasks.front());
                        this->tasks.pop();
                    }
                    
                    // Ejecutar la tarea
                    task();
                }
            });
        }
    }
    
    // Agregar una nueva tarea a la cola
    template<class F>
    void enqueue(F&& f) {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            
            // No aceptar nuevas tareas si el pool está detenido
            if (stop) {
                throw std::runtime_error("Enqueue on stopped ThreadPool");
            }
            
            // Agregar la tarea a la cola
            tasks.emplace(std::forward<F>(f));
        }
        
        // Notificar a un hilo en espera que hay una nueva tarea
        condition.notify_one();
    }
    
    // Destructor - espera a que terminen todas las tareas
    ~ThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            stop = true;
        }
        
        // Despertar a todos los hilos para que comprueben la bandera de parada
        condition.notify_all();
        
        // Esperar a que todos los hilos terminen
        for (std::thread& worker : workers) {
            if (worker.joinable()) {
                worker.join();
            }
        }
    }
};

// Ejemplo de uso
int main() {
    // Crear un thread pool con 4 hilos
    ThreadPool pool(4);
    
    // Contador atómico para tareas completadas
    std::atomic<int> completed(0);
    
    // Encolar 8 tareas
    for (int i = 0; i < 8; ++i) {
        pool.enqueue([i, &completed] {
            // Simular un trabajo que toma tiempo
            std::this_thread::sleep_for(std::chrono::seconds(1));
            
            // Trabajo finalizado
            std::cout << "Tarea " << i << " completada por hilo: " 
                      << std::this_thread::get_id() << std::endl;
            
            // Incrementar contador de tareas completadas
            completed++;
        });
    }
    
    // Esperar a que todas las tareas se completen (el destructor del pool esperará automáticamente)
    while (completed < 8) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    
    std::cout << "Todas las tareas completadas. Pool será destruido." << std::endl;
    
    // El pool se destruirá aquí, esperando a que todos los hilos terminen
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las cabeceras necesarias para trabajar con hilos, colas, mutexes, etc.' },
        { line: 9, text: 'Definimos la clase ThreadPool que implementa el patrón.' },
        { line: 11, text: 'Vector para almacenar los hilos de trabajo.' },
        { line: 14, text: 'Cola de tareas pendientes a ejecutar por los hilos.' },
        { line: 17, text: 'Mutex para proteger el acceso concurrente a la cola de tareas.' },
        { line: 18, text: 'Variable de condición para la sincronización entre hilos.' },
        { line: 21, text: 'Bandera para indicar cuando el pool debe terminar.' },
        { line: 25, text: 'Constructor que inicializa el pool con un número específico de hilos.' },
        { line: 27, text: 'Creamos los hilos trabajadores usando una lambda como función del hilo.' },
        { line: 28, text: 'Bucle infinito donde cada hilo espera y ejecuta tareas.' },
        { line: 33, text: 'Bloqueo para acceder de forma segura a la cola de tareas.' },
        { line: 36, text: 'El hilo espera hasta que haya una tarea o se indique detener el pool.' },
        { line: 40, text: 'Si el pool debe detenerse y no hay tareas, el hilo termina.' },
        { line: 45, text: 'Extrae la siguiente tarea de la cola usando move para evitar copias.' },
        { line: 49, text: 'Ejecuta la tarea fuera del bloque de bloqueo para permitir paralelismo.' },
        { line: 56, text: 'Método para encolar nuevas tareas, con plantilla para aceptar cualquier función.' },
        { line: 58, text: 'Bloqueo para acceder de forma segura a la cola.' },
        { line: 61, text: 'Verificamos que el pool no esté en proceso de cierre.' },
        { line: 65, text: 'Añadimos la tarea a la cola usando perfect forwarding.' },
        { line: 69, text: 'Notificamos a un hilo en espera que hay una nueva tarea disponible.' },
        { line: 73, text: 'Destructor que se encarga de limpiar y esperar a que terminen todos los hilos.' },
        { line: 76, text: 'Establece la bandera de parada dentro de un bloque protegido.' },
        { line: 80, text: 'Notifica a todos los hilos para que comprueben la bandera de parada.' },
        { line: 83, text: 'Espera (join) a que todos los hilos terminen antes de destruir el pool.' },
        { line: 92, text: 'Ejemplo de uso del ThreadPool.' },
        { line: 94, text: 'Creamos un pool con 4 hilos trabajadores.' },
        { line: 97, text: 'Usamos un contador atómico para saber cuándo se han completado todas las tareas.' },
        { line: 100, text: 'Encolamos 8 tareas para que sean ejecutadas por los 4 hilos.' },
        { line: 102, text: 'Cada tarea es una lambda que captura el índice y el contador de completadas.' },
        { line: 104, text: 'Simulamos trabajo que toma tiempo usando sleep_for.' },
        { line: 107, text: 'Imprimimos información sobre la tarea y el hilo que la ejecutó.' },
        { line: 116, text: 'Esperamos a que todas las tareas se completen antes de continuar.' }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <future>
#include <memory>
#include <type_traits>

class ThreadPool {
public:
    // Constructor - inicia los hilos de trabajo
    explicit ThreadPool(size_t numThreads) : stop(false) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    
                    {
                        std::unique_lock<std::mutex> lock(this->queue_mutex);
                        
                        this->condition.wait(lock, [this] {
                            return this->stop || !this->tasks.empty();
                        });
                        
                        if (this->stop && this->tasks.empty()) {
                            return;
                        }
                        
                        task = std::move(this->tasks.front());
                        this->tasks.pop();
                    }
                    
                    task();
                }
            });
        }
    }
    
    // No permitir copia o movimiento
    ThreadPool(const ThreadPool&) = delete;
    ThreadPool& operator=(const ThreadPool&) = delete;
    ThreadPool(ThreadPool&&) = delete;
    ThreadPool& operator=(ThreadPool&&) = delete;
    
    // Encolar una tarea y obtener un futuro para su resultado
    template<class F, class... Args>
    auto enqueue(F&& f, Args&&... args) 
        -> std::future<typename std::invoke_result<F, Args...>::type> {
        
        using return_type = typename std::invoke_result<F, Args...>::type;
        
        // Crear una tarea compartida que puede ser llamada y que devuelve un valor
        auto task = std::make_shared<std::packaged_task<return_type()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...)
        );
        
        // Obtener el futuro antes de que la tarea sea movida a la cola
        std::future<return_type> result = task->get_future();
        
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            
            if (stop) {
                throw std::runtime_error("Enqueue on stopped ThreadPool");
            }
            
            // Envolver la tarea en una void() función para la cola
            tasks.emplace([task]() { (*task)(); });
        }
        
        condition.notify_one();
        return result;
    }
    
    // Destructor - espera a que terminen todas las tareas
    ~ThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            stop = true;
        }
        
        condition.notify_all();
        
        for (std::thread& worker : workers) {
            if (worker.joinable()) {
                worker.join();
            }
        }
    }

private:
    // Vector de hilos trabajadores
    std::vector<std::thread> workers;
    
    // Cola de tareas sin tipo de retorno
    std::queue<std::function<void()>> tasks;
    
    // Sincronización
    std::mutex queue_mutex;
    std::condition_variable condition;
    
    // Bandera de control
    bool stop;
};

// Ejemplo de uso con futuros
int main() {
    // Crear un thread pool con el número de hilos disponibles en el hardware
    ThreadPool pool(std::thread::hardware_concurrency());
    
    std::cout << "Usando " << std::thread::hardware_concurrency() 
              << " hilos en el pool" << std::endl;
    
    // Vector para almacenar los futuros de las tareas
    std::vector<std::future<int>> results;
    
    // Encolar tareas que devuelven resultados
    for (int i = 0; i < 8; ++i) {
        // Enqueue devuelve un futuro que eventualmente contendrá el resultado
        auto result = pool.enqueue([i] {
            // Simular trabajo que toma tiempo variable
            std::this_thread::sleep_for(std::chrono::milliseconds(200 * i));
            
            std::cout << "Tarea " << i << " ejecutada por hilo: " 
                      << std::this_thread::get_id() << std::endl;
            
            // Devolver un resultado basado en el índice
            return i * 10;
        });
        
        // Guardar el futuro para obtener el resultado más tarde
        results.push_back(std::move(result));
    }
    
    // Obtener y mostrar todos los resultados
    for (size_t i = 0; i < results.size(); ++i) {
        // wait() bloqueará hasta que el resultado esté disponible
        std::cout << "Resultado de tarea " << i << ": " 
                  << results[i].get() << std::endl;
    }
    
    std::cout << "Todas las tareas completadas." << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos cabeceras adicionales como future y memory para características de C++ moderno.' },
        { line: 14, text: 'Usamos explicit para evitar conversiones implícitas en el constructor.' },
        { line: 40, text: 'Eliminamos explícitamente las operaciones de copia y movimiento para evitar problemas de concurrencia.' },
        { line: 46, text: 'Método enqueue mejorado que devuelve un std::future para obtener el resultado de la tarea.' },
        { line: 48, text: 'Usamos el trailing return type y std::invoke_result (C++17) para deducir el tipo de retorno.' },
        { line: 52, text: 'Creamos una tarea compartida (shared_ptr) que contiene una packaged_task para vincular el resultado a un future.' },
        { line: 53, text: 'Usamos std::bind con perfect forwarding para soportar cualquier tipo de función y argumentos.' },
        { line: 57, text: 'Obtenemos el future antes de que la tarea se mueva a la cola.' },
        { line: 65, text: 'Envolvemos la tarea compartida en una lambda sin parámetros para la cola.' },
        { line: 69, text: 'Devolvemos el future para que el cliente pueda obtener el resultado cuando esté disponible.' },
        { line: 90, text: 'En C++ moderno, es común poner los miembros privados al final de la clase.' },
        { line: 102, text: 'En el ejemplo, utilizamos std::thread::hardware_concurrency() para obtener el número óptimo de hilos.' },
        { line: 107, text: 'Creamos un vector para almacenar los futuros de todas las tareas.' },
        { line: 112, text: 'Cada tarea devuelve un valor que se obtendrá a través del future.' },
        { line: 122, text: 'Guardamos el future usando std::move para evitar copias.' },
        { line: 127, text: 'Iteramos a través de todos los futuros y obtenemos sus resultados.' },
        { line: 129, text: 'La llamada a get() bloquea hasta que el resultado está disponible.' }
      ]
    },
    java: {
      code: `import java.util.concurrent.*;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

/**
 * Implementación de patrón Thread Pool en Java usando ExecutorService
 */
public class ThreadPoolExample {
    
    public static void main(String[] args) {
        // Crear un thread pool utilizando la API estándar de Java
        int numThreads = Runtime.getRuntime().availableProcessors();
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        
        System.out.println("Usando " + numThreads + " hilos en el pool");
        
        // Lista para almacenar los futuros
        List<Future<Integer>> resultList = new ArrayList<>();
        
        // Enviar tareas al pool
        for (int i = 0; i < 8; i++) {
            final int taskNum = i;
            
            // Crear una tarea que devuelve un resultado (Callable)
            Callable<Integer> task = () -> {
                // Simular trabajo que toma tiempo
                Thread.sleep(200 * taskNum);
                
                System.out.println("Tarea " + taskNum + " ejecutada por hilo: " + 
                                   Thread.currentThread().getName());
                
                // Devolver un resultado basado en el índice
                return taskNum * 10;
            };
            
            // Enviar la tarea al pool y obtener un Future
            Future<Integer> future = executor.submit(task);
            resultList.add(future);
        }
        
        // Obtener y mostrar todos los resultados
        try {
            for (int i = 0; i < resultList.size(); i++) {
                // get() bloqueará hasta que el resultado esté disponible
                System.out.println("Resultado de tarea " + i + ": " + 
                                  resultList.get(i).get());
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        
        // Apagar ordenadamente el thread pool
        executor.shutdown();
        try {
            // Esperar a que terminen todas las tareas o expire el tiempo
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                // Forzar la terminación si expira el tiempo
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }
        
        System.out.println("Todas las tareas completadas y thread pool cerrado.");
    }
    
    /**
     * Ejemplo de implementación personalizada de un ThreadPool simple
     */
    public static class CustomThreadPool {
        private final BlockingQueue<Runnable> taskQueue;
        private final List<WorkerThread> threads;
        private boolean isShutdown;
        
        public CustomThreadPool(int numThreads) {
            taskQueue = new LinkedBlockingQueue<>();
            threads = new ArrayList<>(numThreads);
            isShutdown = false;
            
            // Crear e iniciar los hilos trabajadores
            for (int i = 0; i < numThreads; i++) {
                WorkerThread thread = new WorkerThread();
                thread.start();
                threads.add(thread);
            }
        }
        
        // Enviar una tarea para ejecución
        public void execute(Runnable task) {
            if (isShutdown) {
                throw new IllegalStateException("ThreadPool está cerrado");
            }
            
            try {
                taskQueue.put(task);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Enviar una tarea que devuelve un resultado
        public <T> Future<T> submit(Callable<T> task) {
            FutureTask<T> futureTask = new FutureTask<>(task);
            execute(futureTask);
            return futureTask;
        }
        
        // Cerrar el thread pool
        public void shutdown() {
            isShutdown = true;
            for (WorkerThread thread : threads) {
                thread.interrupt();
            }
        }
        
        // Hilo trabajador que ejecuta tareas de la cola
        private class WorkerThread extends Thread {
            @Override
            public void run() {
                while (!isShutdown) {
                    try {
                        // Tomar una tarea de la cola, bloqueando si es necesario
                        Runnable task = taskQueue.take();
                        task.run();
                    } catch (InterruptedException e) {
                        // Terminar si el hilo es interrumpido
                        break;
                    }
                }
            }
        }
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos las clases necesarias de java.util.concurrent para trabajar con concurrencia.' },
        { line: 7, text: 'Definimos la clase principal de ejemplo.' },
        { line: 11, text: 'Obtenemos el número óptimo de hilos basado en los procesadores disponibles.' },
        { line: 12, text: 'Creamos un ExecutorService usando la API estándar de Java (Executors.newFixedThreadPool).' },
        { line: 16, text: 'Lista para almacenar los futuros que nos permitirán obtener los resultados.' },
        { line: 19, text: 'Iteramos para crear y enviar varias tareas al pool.' },
        { line: 23, text: 'Creamos un Callable que devolverá un resultado (a diferencia de Runnable que no retorna valores).' },
        { line: 25, text: 'Simulamos trabajo con Thread.sleep.' },
        { line: 33, text: 'Enviamos la tarea al pool con submit() y obtenemos un Future.' },
        { line: 39, text: 'Iteramos por todos los futuros para obtener sus resultados.' },
        { line: 42, text: 'La llamada a get() bloquea hasta que el resultado está disponible.' },
        { line: 49, text: 'Iniciamos el apagado ordenado del thread pool con shutdown().' },
        { line: 52, text: 'Esperamos a que las tareas terminen con un tiempo límite.' },
        { line: 64, text: 'Implementación personalizada de un ThreadPool simple para mostrar cómo funciona internamente.' },
        { line: 66, text: 'Usamos BlockingQueue para la cola de tareas, que maneja automáticamente la sincronización.' },
        { line: 73, text: 'Creamos e iniciamos los hilos trabajadores.' },
        { line: 82, text: 'Método para enviar una tarea (Runnable) para ejecución.' },
        { line: 84, text: 'Verificamos si el pool ya está cerrado.' },
        { line: 88, text: 'Añadimos la tarea a la cola, put() bloqueará si la cola está llena.' },
        { line: 95, text: 'Método para enviar una tarea que devuelve un resultado (Callable).' },
        { line: 96, text: 'Usamos FutureTask que implementa tanto Runnable como Future.' },
        { line: 102, text: 'Método para cerrar el thread pool.' },
        { line: 110, text: 'Clase interna que define el hilo trabajador.' },
        { line: 114, text: 'Los hilos ejecutan un bucle continuo hasta que se cierra el pool.' },
        { line: 116, text: 'Toman tareas de la cola con take(), que bloquea si la cola está vacía.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Implementación',
      cppTraditional: 'Implementación manual utilizando primitivas de bajo nivel como std::mutex y std::condition_variable.',
      cppModern: 'Implementación mejorada con soporte para futuros, perfect forwarding y std::invoke_result para tipo de retorno automático.',
      java: 'Utiliza la API de concurrencia estándar (ExecutorService) y ofrece una implementación personalizada para demostración.'
    },
    {
      title: 'Manejo de resultados',
      cppTraditional: 'Utiliza un contador atómico y callbacks para notificar resultados, sin mecanismo integrado para devolver valores.',
      cppModern: 'Utiliza std::future para obtener resultados de forma asíncrona, permitiendo que las tareas devuelvan valores directamente.',
      java: 'Utiliza Future<T> con Callable para tareas que devuelven resultados y FutureTask para la implementación personalizada.'
    },
    {
      title: 'Configuración del pool',
      cppTraditional: 'Número de hilos especificado manualmente en el constructor.',
      cppModern: 'Utiliza std::thread::hardware_concurrency() para obtener el número óptimo de hilos basado en el hardware.',
      java: 'Utiliza Runtime.getRuntime().availableProcessors() para determinar el número óptimo de hilos.'
    },
    {
      title: 'Gestión de recursos',
      cppTraditional: 'Gestión manual de recursos, destructor se encarga de limpieza.',
      cppModern: 'Uso de punteros inteligentes para gestión automática de recursos y prevención explícita de copia/movimiento.',
      java: 'Gestión automática de memoria con el recolector de basura, pero requiere shutdown() explícito para liberar hilos.'
    }
  ],
  
  notes: 'El patrón Thread Pool es fundamental para aplicaciones de alto rendimiento que necesitan ejecutar muchas tareas concurrentes. Aunque las implementaciones mostradas son educativas, en proyectos reales es recomendable utilizar implementaciones probadas como ThreadPoolExecutor en Java o thread pools de bibliotecas como Boost.Asio o C++17 parallel algorithms en C++. La elección del tamaño del pool es crítica: demasiado pequeño limita el paralelismo, demasiado grande causa sobrecarga por cambios de contexto. Una regla general es usar el número de núcleos para tareas intensivas en CPU y más hilos para tareas bloqueantes de I/O. En sistemas modernos, también existen alternativas como los work-stealing thread pools que permiten mejor equilibrio de carga y task-based parallelism que ofrece una abstracción de más alto nivel.'
};

export default threadPoolPattern; 