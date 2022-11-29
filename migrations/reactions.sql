 create table reactions(
 id int not null auto_increment,
 user_id int not null,
 target_id int not null,
 target_type varchar(10) not null,
 primary key(id),
 constraint fk_reactions_users foreign key (user_id) references users(id)
 )engine=innoDB;