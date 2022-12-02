create table follow(
     id int not null auto_increment,
     user_email varchar(15) not null,
     target_user_id int not null,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     primary key(id),
     constraint fk_subscribers_users foreign key (target_user_id) references users(id)
     )engine = innodb;