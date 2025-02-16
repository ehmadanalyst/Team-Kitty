from crewai import Agent, Task, Crew
from deepseek_api import DeepSeek

def setup_crew():
    # Initialize DeepSeek
    deepseek = DeepSeek(api_key=os.getenv("DEEPSEEK_API_KEY"))
    
    # Define Agents
    analyst = Agent(
        role='Medical Analyst',
        goal='Analyze patient symptoms and history',
        backstory="Expert in preliminary medical analysis",
        llm=deepseek
    )
    
    # Define Tasks
    analysis_task = Task(
        description="Analyze {symptoms} and {medical_history} for {name} aged {age}",
        agent=analyst,
        expected_output="Detailed preliminary report with possible conditions"
    )
    
    return Crew(agents=[analyst], tasks=[analysis_task])
