# agents/user_agent.py
from crewai import Agent

def create_user_agent():
    user_agent = Agent(
        role="Patient",
        goal="Provide accurate symptoms and medical history to the doctor.",
        backstory="You are a patient seeking medical assistance. You want to describe your symptoms and medical history clearly so the doctor can help you.",
        verbose=True  # Set to True or False (boolean value)
    )
    return user_agent