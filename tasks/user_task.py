# tasks/user_task.py
from crewai import Task

def create_user_task(user_agent):
    user_task = Task(
        description="Describe your symptoms and any previous medical history.",
        agent=user_agent,
        expected_output="Symptoms: Headache, fever. Medical History: None."
    )
    return user_task