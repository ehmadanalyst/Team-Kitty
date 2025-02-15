# agents/doctor_agent.py
from crewai import Agent

def create_doctor_agent():
    doctor_agent = Agent(
        role="Doctor",
        goal="Analyze the patient's symptoms and medical history to provide accurate recommendations.",
        backstory="You are a highly skilled doctor with expertise in diagnosing and treating patients. You carefully analyze patient inputs to provide the best advice.",
        verbose=True  # Set to True or False (boolean value)
    )
    return doctor_agent