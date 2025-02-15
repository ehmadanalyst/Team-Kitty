# tasks/doctor_task.py
from crewai import Task

def create_doctor_task(doctor_agent):
    doctor_task = Task(
        description="Analyze the patient's symptoms and medical history to provide recommendations for diet and medication.",
        agent=doctor_agent,
        expected_output="A detailed report with recommendations for diet and medication based on the patient's symptoms and medical history."
    )
    return doctor_task