# Guess-A-Sketch

Deployed at [sketch.zarns.net](https://sketch.zarns.net). The backend is takes a minute to spin up because it's hosted on the free tier of [render.com](https://render.com/). Also, check out my [portfolio](https://mason.zarns.net)

## Installation

1. Clone the repo

   ```sh
   git clone https://github.com/zarns/guess-a-sketch.git
   ```

2. Setup environment

   ```sh
   npm install
   ```

3. From the `client` and `server` directories, run locally on `port 3000`. Modify /client/.env to point to localhost:3001 instead of the URL from render.com

   ```sh
   npm run dev
   ```

    * Open [http://localhost:3000/](http://localhost:3000/) in browser
    * The server should run on port 3001
    * Edit a file and save. Watch changes deploy locally in seconds. Start with `src/data/data.tsx`

## Deployment to AKS

1. Install
    * Docker Desktop
    * Azure CLI
    * kubectl

2. Run locally. From root directory

   ```sh
   docker-compose up
   ```

3. Build Docker images and push images to Docker Hub

   ```sh
   docker-compose build
   docker-compose push
   ```

4. Apply manifest.yml to deploy to Azure Kubernetes Service (AKS)

   ```sh
   kubectl apply -f k8s/manifest.yml
   ```

5. Useful

   ```sh
   az aks get-credentials --resource-group <resource-group-name> --name <aks-cluster-name>
   kubectl get deployments
   kubectl get services
   kubectl get pods
   kubectl logs server-deployment-7f5f9d746f-hzrsg
   kubectl logs client-deployment-6cb48766b4-9djxd
   ```

6. Realize Azure AKS is charging ~$5/day. Deploy frontend to Vercel and backend to the free tier of [render.com](https://render.com/) instead!

## Acknowledgments

Major thanks to these resources:

* [ChatGPT](https://chat.openai.com/chat)
* [Josh tried coding](https://www.youtube.com/watch?v=Dib5TYHHfgA)
* [favicon source](https://icons8.com/icons/set/marker)
* [react dev tools](https://react.dev/learn/react-developer-tools)
