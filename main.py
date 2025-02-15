# main.py
from crew.setup_crew import setup_crew

if __name__ == "__main__":
    # Set up and run the crew
    crew = setup_crew()
    result = crew.kickoff()

    # Print the final result
    print("Final Result:")
    print(result)