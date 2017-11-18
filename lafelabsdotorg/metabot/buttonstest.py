import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

GPIO.setup(9,GPIO.IN, pull_up_down=GPIO.PUD_UP) #
GPIO.setup(11,GPIO.IN, pull_up_down=GPIO.PUD_UP) # 
GPIO.setup(0,GPIO.IN, pull_up_down=GPIO.PUD_UP) # 
GPIO.setup(5,GPIO.IN, pull_up_down=GPIO.PUD_UP) #
GPIO.setup(6,GPIO.IN, pull_up_down=GPIO.PUD_UP) # 
GPIO.setup(13,GPIO.IN, pull_up_down=GPIO.PUD_UP) #
GPIO.setup(19,GPIO.IN, pull_up_down=GPIO.PUD_UP) # 
GPIO.setup(26,GPIO.IN, pull_up_down=GPIO.PUD_UP) #


print("Here we go! Press CTRL+C to exit")
try:
    while 1:
        if not GPIO.input(9): #
            print("9")
        if not GPIO.input(11): #
            print("11")
        if not GPIO.input(0): #
            print("0")
        if not GPIO.input(5): #
            print("5")
        if not GPIO.input(6): #
            print("6")
        if not GPIO.input(13): #
            print("13")
        if not GPIO.input(19): #
            print("19")
        if not GPIO.input(26): #
            print("26")



except KeyboardInterrupt: # If CTRL+C is pressed, exit cleanly:
    GPIO.cleanup() # cleanup all GPIO


