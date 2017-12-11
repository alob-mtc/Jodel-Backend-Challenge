all: 
	docker-compose run web yarn test

test: 
	docker-compose run -e LOGGER_STREAM=file web yarn test

run:
	docker-compose up web

run_prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up web

seed:
	docker-compose run web yarn seed
