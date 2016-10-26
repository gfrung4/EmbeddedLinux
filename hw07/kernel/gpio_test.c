#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/gpio.h>
#include <linux/interrupt.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Derek Molloy and Ricky Rung");
MODULE_DESCRIPTION("Reads the value of P9_28 and copies it to P9_27.");
MODULE_VERSION("0.1");

static unsigned int gpioLED = 115;
static unsigned int gpioButton = 113;
static unsigned int irqNumber;

static irq_handler_t  ebbgpio_irq_handler(unsigned int irq, void *dev_id, struct pt_regs *regs);

static int __init ebbgpio_init(void){
   int result = 0;

   gpio_request(gpioLED, "sysfs");
   gpio_request(gpioButton, "sysfs");

   gpio_direction_input(gpioButton);
   gpio_direction_output(gpioLED, gpio_get_value(gpioButton));

   gpio_export(gpioLED, false);
   gpio_export(gpioButton, false);

   irqNumber = gpio_to_irq(gpioButton);

   result = request_irq(irqNumber,
                        (irq_handler_t) ebbgpio_irq_handler,
                        IRQF_TRIGGER_RISING | IRQF_TRIGGER_FALLING,
                        "ebb_gpio_handler",
                        NULL);

   return result;
}

static void __exit ebbgpio_exit(void){
   gpio_set_value(gpioLED, 0);
   gpio_unexport(gpioLED);
   free_irq(irqNumber, NULL);
   gpio_unexport(gpioButton);
   gpio_free(gpioLED);
   gpio_free(gpioButton);
}

static irq_handler_t ebbgpio_irq_handler(unsigned int irq, void *dev_id, struct pt_regs *regs){
   gpio_set_value(gpioLED, !gpio_get_value(gpioButton));
   return (irq_handler_t) IRQ_HANDLED;
}

module_init(ebbgpio_init);
module_exit(ebbgpio_exit);
