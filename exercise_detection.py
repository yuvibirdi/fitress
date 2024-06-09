# Including Important libraries
import cv2
import mediapipe as mp
import numpy as np
import time
from datetime import timedelta
import socket
from datetime import datetime


mp_drawing  = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

jjcounter = 0  # Counter for jumping jacks
sqcounter = 0  # Counter for squats
hkcounter = 0  # Counter for high knees
swcounter = 0  # Counter for sways
flcounter = 0  # Counter for flexes
stage = None  # Holds the stage of the exercise the user is on

# Lower and upper boundaries for camera
webcam_lower_bound = -0.5
webcam_upper_bound = 1.5

# The start time of the program
start = time.time()

# Calculates the angle between coordinates a, b, and c (which are all x, y coordinates)
def calculate_angle(a,b,c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0])-np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)

    if angle>180.0:
        angle=360-angle
    
    return angle

# Validates that the x and y value for each land mark (in an array of land marks) is between a lower and upper bound range
def check_validity(land_marks):
    
    for i in land_marks:
        if(i[0]<webcam_lower_bound or i[0]>webcam_upper_bound or i[1]<webcam_lower_bound or i[1]>webcam_upper_bound):
            return False
        
    return True
    
# Does UDP send
def udp_send(ex_name):
    with open("exercise.txt", "w") as file:
        file.write(ex_name + "\n")

    
    

    # UDP_IP = "127.0.0.1"
    # UDP_PORT = 5005
    # MESSAGE = (ex_name).encode()
    # print("UDP target IP: %s" % UDP_IP)
    # print("UDP target port: %s" % UDP_PORT)
    # print("message: %s" % MESSAGE)
    # sock = socket.socket(socket.AF_INET, # Internet
    #                     socket.SOCK_DGRAM) # UDP
    # sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))


# Captures webcam footage
cap = cv2.VideoCapture(0)

# Gets tracker
with mp_pose.Pose(min_detection_confidence = 0.5, min_tracking_confidence = 0.5) as pose:
    
    # While webcam is open
    while cap.isOpened():

        image = cap.read()[1] # Reads images from video

        # Recolor image to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        # Make detection
        results = pose.process(image)
        
        # Recolor back to BGR
        image.flags.writeable = True  # Make image writable
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Extract Landmarks
        try:
            
            landmarks = results.pose_landmarks.landmark

            # Get coordinates of each landmark on user
            #   1 --> user's left
            #   2 --> user's right
            shoulder1=[landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            hip1=[landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            wrist1=[landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
            ankle1=[landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
            knee1=[landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            elbow1=[landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

            shoulder2=[landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            hip2=[landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            wrist2=[landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
            ankle2=[landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
            knee2=[landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            elbow2=[landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
            # print((landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x+landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x)/2.0)
            chest=[(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x+landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x)/2.0, (landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y+landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y)/2.0]
            # Calculates angle
            hip_shoulder_wrist1 = calculate_angle(hip1, shoulder1, wrist1)
            hip_shoulder_wrist2 = calculate_angle(hip2, shoulder2, wrist2)
            
            shoulder_hip_ankle1 = calculate_angle(shoulder1, hip1, ankle1)
            shoulder_hip_ankle2 = calculate_angle(shoulder2, hip2, ankle2)
            
            hip_knee_ankle1 = calculate_angle(hip1, knee1, ankle1)
            hip_knee_ankle2 = calculate_angle(hip2, knee2, ankle2)
            
            shoulder_hip_knee1 = calculate_angle(shoulder1, hip1, knee1)
            shoulder_hip_knee2 = calculate_angle(shoulder2, hip2, knee2)
            
            shoulder_ankle_wrist1 = calculate_angle(shoulder1, ankle1, wrist1)
            shoulder_ankle_wrist2 = calculate_angle(shoulder2, ankle2, wrist2)
            
            shoulder_elbow_wrist1 = calculate_angle(shoulder1, elbow1, wrist1)
            shoulder_elbow_wrist2 = calculate_angle(shoulder2, elbow2, wrist2)

            chest_shoulder_wrist1 = calculate_angle(chest, shoulder1, wrist1)
            chest_shoulder_wrist2 = calculate_angle(chest, shoulder2, wrist2)
            
            elbow_shoulder_hip1 = calculate_angle(elbow1, shoulder1, hip1)
            elbow_shoulder_hip2 = calculate_angle(elbow2, shoulder2, hip2)
            
            # Detects jumping jacks:
            jj_land_marks = [hip1, hip2, shoulder1, shoulder2, wrist1, wrist2, ankle1, ankle2]
            if(check_validity(jj_land_marks)):
                if hip_shoulder_wrist1 < 30 and hip_shoulder_wrist2 < 30 and shoulder_hip_ankle1 > 170 and shoulder_hip_ankle2 > 170 :
                    if(stage=='jjup1'):
                        jjcounter+=1
                        udp_send("Jumping Jack")
                    stage = 'jjdown1'

                #   Down + Inverse
                if hip_shoulder_wrist1 < 30 and hip_shoulder_wrist2 < 30 and shoulder_hip_ankle1 < 170 and shoulder_hip_ankle2 < 170 :
                    if(stage=='jjup2'):
                        jjcounter+=1
                        udp_send("Jumping Jack")
                    stage = 'jjdown2'
                    
                #   Up + Regular
                if hip_shoulder_wrist1 > 150 and hip_shoulder_wrist2 > 150 and shoulder_hip_ankle1 < 170 and shoulder_hip_ankle2 < 170 and stage == 'jjdown1':
                    stage = 'jjup1'
                    
                #   Up + Inverse
                if hip_shoulder_wrist1 > 150 and hip_shoulder_wrist2 > 150 and shoulder_hip_ankle1 > 170 and shoulder_hip_ankle2 > 170 and stage == 'jjdown2':
                    stage = 'jjup2' 



            # Detects squats:
            sq_land_marks = [hip1, hip2, knee1, knee2, ankle1, ankle2]
            if(check_validity(sq_land_marks)):
                #   Down
                if hip_knee_ankle1<=100 and hip_knee_ankle2<=100:
                    stage='sqdown'
                    
                #   Up
                if hip_knee_ankle1>=160 and hip_knee_ankle2>=160 and stage=='sqdown':
                    stage='squp'
                    sqcounter+=1
                    udp_send("Squat")
            
            
            
            # Detect high knees:
            # hk_land_marks = [shoulder1, shoulder2, hip1, hip2, knee1, knee2]
            # if(check_validity(hk_land_marks)):
                
            #     # print(f'Shoulder Hip Knee 1: {shoulder_hip_knee1}')
            #     # print(f'Hip Knee Ankle 1: {hip_knee_ankle1}')
            #     # print(f'Shoulder Hip Knee 2: {shoulder_hip_knee2}')
            #     # print(f'Hip Knee Ankle 2: {hip_knee_ankle2}')
            #     # print(f'Stage: {stage}')
                
            #     #   Left
            #     if shoulder_hip_knee1<=140 and hip_knee_ankle1<=120 and shoulder_hip_knee2>=140 and hip_knee_ankle2>=140:
            #         if(stage=='hkright'):
            #             hkcounter+=1
            #             udp_send("High Knee")
            #         stage='hkleft'
                    
            #     #   Right
            #     if shoulder_hip_knee1>=140 and hip_knee_ankle1>=140 and shoulder_hip_knee2<=140 and hip_knee_ankle2<=120:
            #         if(stage=='hkleft'):
            #             hkcounter+=1
            #             udp_send("High Knee")
            #         stage='hkright'
                    
                    
                    
            # Detect sways:
            sway_land_marks = [chest, shoulder1, shoulder2, wrist1, wrist2, ankle1, ankle2]
            if(check_validity(sway_land_marks)):
                # print(f'chest1: {chest_shoulder_wrist1}')
                # print(f'chest2: {chest_shoulder_wrist2}')
                # print(f'Hip1: {hip_shoulder_wrist1}')
                # print(f'Hip2: {hip_shoulder_wrist2}')
                # print(f'Shoulder1: {shoulder_hip_ankle1}')
                # print(f'Shoulder2: {shoulder_hip_ankle2}')
                # print(f'Stage: {stage}')
                
                if chest_shoulder_wrist1 > 150 and hip_shoulder_wrist2 < 30:
                    if(stage=='jjdown1' or stage=='jjdown2'):
                        swcounter+=1
                        udp_send("Sway Right")
                    stage="swright"
                
                if chest_shoulder_wrist2 > 150 and hip_shoulder_wrist1 < 30:
                    if(stage=='jjdown1' or stage=='jjdown2'):
                        swcounter+=1
                        udp_send("Sway Left")
                    stage="swleft"
            
            
            
            # Detect flex:
            flex_land_marks = [elbow1, elbow2, shoulder1, shoulder2, wrist1, wrist2]
            if(check_validity(flex_land_marks)):
                if elbow_shoulder_hip1 > 40 and elbow_shoulder_hip2 > 40 and shoulder_elbow_wrist1 < 60 and shoulder_elbow_wrist2 < 60:
                    if(stage!='flexup'):
                        flcounter+=1
                        udp_send("Flex")
                        stage="flexup"
                
                if elbow_shoulder_hip1 < 60 and elbow_shoulder_hip2 < 60 and shoulder_elbow_wrist1 > 120 and shoulder_elbow_wrist2 > 120:
                    if(stage=="flexup"):
                        flcounter+=1
                        stage="flexdown"
                
            
        except:
            pass

        # Render detections
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
                                mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                                )
    cap.release()
