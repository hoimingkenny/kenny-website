# LangChain

## Ollama
```
ollama run llama2

lsof -i :11434
ollama serve
```

## Prompt Engineering
- Define character -> Question -> Target/Requiremnt -> What you want in the response

## FewShot
- refers to the ability of a model to perform a task with only a small number of examples or prompts provided in the input, without requiring extensive fine-tuning or retraining
- you provide the LLM witha prompt that includes a few examples of the task you want it to perform, and then ask it to perform the task on a new example

## Example Selector
- Length based example selector
    - used in the context of few-shot learning with LLM to choose examples for inclusion in a prompt based on their length. This is particularly useful when constructing prompts for tasks where the total prompt size is constrained (e.g., due to token limits)

- Semantic Similarity Example Selector

## Agent
- Single Agent: LangChain
- Multi Agent: LangGraph