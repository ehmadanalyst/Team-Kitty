import streamlit as st
from crew.setup_crew import setup_crew

def main():
    st.title("Patient Assistance App 🏥")
    
    # Patient Input Section
    with st.form("patient_input"):
        st.header("Patient Registration")
        name = st.text_input("Name")
        age = st.number_input("Age", min_value=0)
        symptoms = st.text_area("Symptoms")
        submitted = st.form_submit_button("Generate Report")
        
        if submitted:
            # Initialize CrewAI
            medical_crew = setup_crew()
            
            # Process inputs through CrewAI
            result = medical_crew.kickoff(inputs={
                'name': name,
                'age': age,
                'symptoms': symptoms
            })
            
            # Display results
            st.subheader("Preliminary Report")
            st.write(result)
            st.success("Report generated! Doctor will contact you soon.")

if __name__ == "__main__":
    main()
