# crew/setup_crew.py
from crewai import Crew
from agents.user_agent import create_user_agent
from agents.doctor_agent import create_doctor_agent
from tasks.user_task import create_user_task
from tasks.doctor_task import create_doctor_task
from langchain_openai import ChatOpenAI
import litellm
litellm._turn_on_debug()
def setup_crew():
    # Set OpenAI API key
    llm = ChatOpenAI(
        model="gpt-3.5-turbo",  # You can use "gpt-4" if you have access
        api_key=""  # Replace with your OpenAI API key
    )

    # Create agents
    user_agent = create_user_agent()
    doctor_agent = create_doctor_agent()

    # Create tasks
    user_task = create_user_task(user_agent)
    doctor_task = create_doctor_task(doctor_agent)

    # Create and configure the crew
    crew = Crew(
        agents=[user_agent, doctor_agent],
        tasks=[user_task, doctor_task],
        verbose=True,
        llm=llm  # Pass the LLM configuration
    )
    return crew